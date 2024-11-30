import ServerSidebar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

const FriendIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { serverId: string };
}) => {
    const profile = await currentProfile()
    const { serverId } = await params
    if (!profile) {
        return redirect("/sign-in")
    }

    const friend = await db.connection.findFirst({
        where: {
            OR: [
                {
                    profileOneId: profile.id,
                },
                {
                    profileTwoId: profile.id,
                },
            ]
        }
    });
    if (!friend) {
        return redirect("/")
    }

    return (
        <div className="h-full">
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}

export default FriendIdLayout;