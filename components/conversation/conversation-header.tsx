"use client"

const ConversationHeader = () => {
    return (
        <div
            className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        >
            Direct messages
        </div>
    );
}

export default ConversationHeader;