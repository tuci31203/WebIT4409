import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
    const profile = await currentProfile()
    if (!profile) {
        return redirect("/")
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    return (
        <div
            className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] bg-[#e3e5e8] py-3"
        >
            <NavigationAction profile={profile} />
            <ScrollArea className="flex-1 w-full">
                {servers.map(server => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            image={server.image}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
    );
};
