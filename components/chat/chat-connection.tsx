"use client"

import { Connection, ConnectionStatus } from "@prisma/client"
import { Button } from "../ui/button";
import { UserRoundCheck, UserRoundPlus, UserRoundX, X } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface ChatConnectionProps {
    connection?: Connection;
    profileId?: string;
}

export const ChatConnection = ({
    connection, profileId
}: ChatConnectionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [connectionId, setConnectionId] = useState(connection?.id)
    console.log(connectionId)

    useEffect(() => {
        if(!connection) return;
        if(connection?.status === ConnectionStatus.FRIEND) setStatus("friends")
        if(connection?.status === ConnectionStatus.REQUESTING) {
            if(connection.profileOneId === profileId) setStatus("requested")
            else setStatus("requesting")
        }
    }, [connection, profileId])
    const onAddFriend = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post('/api/connections', { requestedProfileId: profileId});
            setConnectionId(res.data?.id);
            setStatus("requesting")
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }
    // For unfriend, decline, cancel request
    const onUnrequest = async () => {
        try {
            setIsLoading(true);
            const res = await axios.delete(`/api/connections/${connectionId}`);
            setConnectionId(res.data?.id);
            setStatus("")
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const onAccept = async () => {
        try {
            setIsLoading(true);
            const res = await axios.patch(`/api/connections/${connectionId}`);
            setConnectionId(res.data?.id);
            setStatus("friends")
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    if(status === "friends") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        disabled={isLoading}
                        variant="friend"
                        size='connection'
                        className="focus-visible:outline-none"
                    >
                        <UserRoundCheck className="w-4 h-4" />
                        Friends
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" alignOffset={8}>
                    <DropdownMenuItem onClick={onUnrequest} className="text-sm px-1 py-1">
                        <UserRoundX className="w-4 h-4" />
                        Unfriend
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
    if(status === "requesting") {
        return (
            <Button 
                disabled={isLoading}
                variant="not_friend"
                size='connection'
                onClick={onUnrequest}
            >
                <UserRoundX className="w-4 h-4" />
                Cancel request
            </Button>
        )
    }
    if(status === "requested") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
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
                    <DropdownMenuItem onClick={onAccept} className="text-sm px-1 py-1">
                        <UserRoundCheck className="w-4 h-4" />
                        Accept
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onUnrequest} className="text-sm px-1 py-1">
                        <X className="w-4 h-4" />
                        Decline
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
    
    return (
        <Button 
            disabled={isLoading}
            variant="not_friend"
            size='connection'
            onClick={onAddFriend}
        >
            <UserRoundPlus className="w-4 h-4" />
            Add friend
        </Button>
    )
}