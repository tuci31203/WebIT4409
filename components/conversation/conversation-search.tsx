"use client"

import { Search } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import axios from "axios";
import { ScrollArea } from "../ui/scroll-area";

const SearchedUser = ({ user, onClick }: { user: Profile, onClick: () => void }) => {
    return (
        <div className="flex items-center gap-x-2 cursor-pointer" onClick={onClick}>
            <UserAvatar
                src={user.image}
                className="h-8 w-8 md:h-8 md:w-8"
            />
           <div className="flex flex-col gap-y-1">
                <p className="text-xs font-semibold flex items-center gap-x-1">
                    {user.name}
                </p>
                <p className="text-xs text-zinc-500" >
                    {user.email}
                </p>
            </div>
        </div>
    )
}

interface ConversationSearchProps {
    profile: Profile;
    peopleChattedWith: Profile[];
}

export const ConversationSearch = ({ profile, peopleChattedWith }: ConversationSearchProps) => {
    const [open, setOpen] = useState(false);
    const [peopleFound, setPeopleFound] = useState<Profile[]>([]);
    const [conversationsFound, setConversationsFound] = useState<Profile[]>([]);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }

        document.addEventListener("keydown", down)

        return () => document.removeEventListener("keydown", down)
    }, []);

    useEffect(() => {
        setConversationsFound(peopleChattedWith)
    }, [peopleChattedWith])

    const onSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        const keyword = event.target.value;
        if(!keyword) {
            setConversationsFound(peopleChattedWith)
        }
        else {
            try {
                const res = await axios.get(`/api/profiles/name/${keyword}`);
                const people = res.data;
                const results: Profile[] = [];
                setConversationsFound(
                    people.filter((user: Profile) => {
                        if(peopleChattedWith.some(acquaintance => user.id === acquaintance.id)) return true;
                        else {
                            results.push(user)
                            return false;
                        }
                    }
                ));
                setPeopleFound(results)
            } catch(err) {
                console.log(err);
            }
            
        }
    }

    const onUserClick = (otherUserId: string) => {
        router.push(`/conversations/${otherUserId}`);
        setOpen(false);
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
            >
                <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <p
                    className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
                >
                    Search
                </p>
                <kbd
                    className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto"
                >
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white text-black p-0 overflow-hidden">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-2xl text-center font-bold">
                            Find your friends
                        </DialogTitle>
                        <Input 
                            placeholder="Search" 
                            onChange={onSearch}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        />
                    </DialogHeader>
                    <ScrollArea className="max-h-[420px] px-6 mb-6">
                        {(peopleFound.length === 0 && conversationsFound.length === 0) && (
                            <div className="flex flex-col flex-1 justify-center items-center">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400" >
                                    No users found
                                </p>
                            </div>
                        )}
                        {peopleFound.length > 0 && (
                            <div className="mb-6">
                                <div className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    People
                                </div>
                                {peopleFound.map((profile: Profile, index: number) => (
                                    <SearchedUser 
                                        user={profile}
                                        onClick={() => onUserClick(profile.id)}
                                        key={index}  
                                    />
                                ))}
                            </div>
                        )}
                        {conversationsFound.length > 0 && (
                            <div>
                                <div className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 mb-3">
                                    Conversations
                                </div>
                                {conversationsFound.map((profile: Profile, index: number) => (
                                    <SearchedUser 
                                        user={profile}
                                        onClick={() => onUserClick(profile.id)}
                                        key={index}  
                                    />
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                    
                    
                </DialogContent>
                
            
            </Dialog>
        </>
    )
}