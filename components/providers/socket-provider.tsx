"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const SockerContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SockerContext);
};

export const SocketProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    }, []);

    return (
        <SockerContext.Provider value={{ socket, isConnected }} >
            {children}
        </SockerContext.Provider>
    )
}