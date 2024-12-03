"use client";

import { UserRoundCheck, UserRoundPlus, X } from "lucide-react"
import { ActionTooltip } from "../action-tooltip"
import { useEffect, useState } from "react"
import { useSocket } from "../providers/socket-provider";
import { Profile } from "@prisma/client";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import { Button } from "../ui/button";
import { ConnectionWithProfile } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";


export const FriendRequestsTooltip = ({ profile }: { profile: Profile }) => {
    const [open, setOpen] = useState(false);
    const [requests, setRequests] = useState<ConnectionWithProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasNewRequests, setHasNewRequests] = useState(() => {
        const newReq = localStorage.getItem("hasNewRequests");
        if (newReq != null) {
            return JSON.parse(newReq);
        } else {
            localStorage.setItem("hasNewRequests", JSON.stringify(false));
            return false;
        }
    });
    const { socket } = useSocket();
    useEffect(() => {
        if (!socket) {
            return;
        }
        console.log("SOCKET")
        const newRequestKey = `connections:${profile.id}:incoming`;
        const deleteRequestKey = `connections:${profile.id}:delete`;
        socket.on(newRequestKey, (connection: ConnectionWithProfile) => {
            setRequests(requests => requests.concat([connection]));
            setHasNewRequests(true);
            localStorage.setItem("hasNewRequests", JSON.stringify(true));
        });

        socket.on(deleteRequestKey, (deletedConnection: ConnectionWithProfile) => {
            console.log("DELETE", deletedConnection);
            setRequests(requests => requests.filter((connection) => connection.id !== deletedConnection.id));
            if (requests.length === 0) {
                setHasNewRequests(false);
                localStorage.setItem("hasNewRequests", JSON.stringify(false));
            }
        });

        return () => {
            socket.off(newRequestKey);
            socket.off(deleteRequestKey);
        }
    }, [socket, profile]);

    const onOpenRequests = async () => {
        try {
            const res = await axios.get("/api/connections/incoming_requests");
            setRequests(res.data);
            setOpen(true);
            setHasNewRequests(false);
            localStorage.setItem("hasNewRequests", JSON.stringify(false));
        } catch (err) {
            setOpen(false);
            console.log(err);
        }
    }
    const onAccept = async (connectionId: string) => {
        try {
            setIsLoading(true);
            const res = await axios.patch(`/api/socket/connections/${connectionId}`);
            setRequests(requests => requests.filter((connection) => connection.id !== connectionId));
        } catch (err) {
            console.log(err);
            setOpen(false);
        } finally {
            setIsLoading(false);
        }
    }
    const onDecline = async (connectionId: string) => {
        try {
            setIsLoading(true);
            const res = await axios.delete(`/api/socket/connections/${connectionId}`);
            setRequests(requests => requests.filter((connection) => connection.id !== connectionId));
        } catch (err) {
            console.log(err);
            setOpen(false);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            <ActionTooltip
                side="right"
                align="center"
                label="Friend requests"
            >
                <button
                    onClick={onOpenRequests}
                    className="group flex items-center relative"
                >
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-indigo-500">
                        <UserRoundPlus
                            className="group-hover:text-white transition dark:text-indigo-200 text-indigo-500"
                            size={25}
                        />
                    </div>
                    {hasNewRequests && (
                        <span className="absolute top-0 right-[4px] h-3 w-3 bg-teal-500 rounded-full"></span>
                    )}
                </button>
            </ActionTooltip>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white text-black p-0 overflow-hidden">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-xl text-center font-bold">
                            Friend Requests
                        </DialogTitle>
                        <DialogDescription
                            className="text-center text-zinc-500"
                        >
                            {requests.length} Requests
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="mt-8 max-h-[420px] px-6 pb-4">
                        {requests.map((connection, index) => {
                            return (
                                <div className="flex items-center gap-x-2 mb-2" key={index}>
                                    <UserAvatar
                                        src={connection.profileOne.image}
                                        className="h-8 w-8 md:h-8 md:w-8"
                                    />
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-xs font-semibold flex items-center gap-x-1">
                                            {connection.profileOne.name}
                                        </p>
                                        <p className="text-xs text-zinc-500" >
                                            {connection.profileOne.email}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild className="ml-auto">
                                            <Button
                                                disabled={isLoading}
                                                variant="not_friend"
                                                size='connection'
                                                className="focus-visible:outline-none"
                                            >
                                                <UserRoundCheck className="w-4 h-4" />
                                                Respond
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" alignOffset={8}>
                                            <DropdownMenuItem onClick={() => onAccept(connection.id)} className="text-sm px-1 py-1">
                                                <UserRoundCheck className="w-4 h-4" />
                                                Accept
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDecline(connection.id)} className="text-sm px-1 py-1">
                                                <X className="w-4 h-4" />
                                                Decline
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            );
                        })}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    )
}