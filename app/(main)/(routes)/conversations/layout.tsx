import ConversationSidebar from "@/components/conversation/conversation-sidebar";
import { currentProfile } from "@/lib/current-user-profile"
import { redirect } from "next/navigation"

const ConversationLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const profile = await currentProfile()
    if (!profile) {
        return redirect("/sign-in")
    }

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ConversationSidebar profile={profile} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}

export default ConversationLayout;