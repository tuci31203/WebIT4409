import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    friendProfileId: string;
  }
}


const ServerIdPage = async ({
  params
}: ServerIdPageProps) => {
  const profile = await currentProfile();
  const { friendProfileId } = await params;

  if (!profile) {
    redirect('/sign-in'); // Redirects server-side to the sign-in page
    return null;
  }

  const server = await db.server.findFirst({
    where: {
      AND: [
        { 
          members: {
            some: {
              profileId: profile.id
            }
          }
        },
        { 
          members: {
            some: {
              profileId: friendProfileId
            }
          }
        },
      ]
    }
  })

  if(!server) {
    return redirect("/");
  }

  const member = await db.member.findFirst({
    where: {
      serverId: server.id,
      profileId: friendProfileId
    }
  })

  if(!member) {
    return redirect("/");
  }

  return redirect(`/servers/${server.id}/conversations/${member.id}`)
}

export default ServerIdPage
