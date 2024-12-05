
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar"
import ConversationSidebar from "./conversation-sidebar";
import { Profile } from "@prisma/client";


export const ConversationMobileToggle = ({
    profile
}: { profile: Profile; }) => {

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <VisuallyHidden.Root>
                    <SheetTitle></SheetTitle>
                </VisuallyHidden.Root>
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>

                <ConversationSidebar
                    profile={profile}
                />

            </SheetContent>
        </Sheet>
    )
}