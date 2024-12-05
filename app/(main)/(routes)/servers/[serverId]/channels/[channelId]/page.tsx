import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { EmojiEffectHandler } from "@/components/effects/emoji-effect-handler";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-user-profile";
import db from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";


interface ChannelIdPageProps {
  params: Promise<{
    serverId: string
    channelId: string
  }>
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const user = await currentProfile()
  const { serverId, channelId } = await params

  const channel = await db.channel.findUnique({
    where: {
      id: channelId
    }
  })

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      userId: user?.id
    }
  })

  if (!channel || !member) {
    redirect('/')
  }

  return (
    <div
      className="bg-white dark:bg-[#313338] flex flex-col h-full"
    >
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <EmojiEffectHandler />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom
          chatId={channel.id}
          video={false}
          audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )}
    </div>
  );
}

export default ChannelIdPage
