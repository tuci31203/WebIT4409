"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from "@/components/providers/socket-provider";

interface EmojiEffectProps {
    emoji: string;
    isActive: boolean;
    onComplete: () => void;
}

const EmojiExplosion: React.FC<EmojiEffectProps> = ({ emoji, isActive, onComplete }) => {
    const generateEmojiPositions = () => {
        return Array.from({ length: 20 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 2 + 1,
            rotation: Math.random() * 360
        }));
    };

    const [emojiPositions, setEmojiPositions] = useState(generateEmojiPositions());

    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                onComplete();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isActive, onComplete]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {emojiPositions.map((pos, index) => (
                <motion.div
                    key={index}
                    initial={{
                        opacity: 1,
                        x: pos.x,
                        y: pos.y,
                        scale: 0,
                        rotate: 0
                    }}
                    animate={{
                        opacity: [1, 0.7, 0],
                        x: [pos.x, pos.x + (Math.random() - 0.5) * 200, pos.x + (Math.random() - 0.5) * 400],
                        y: [pos.y, pos.y - Math.random() * 300, pos.y - Math.random() * 600],
                        scale: [0, pos.scale, 0],
                        rotate: pos.rotation
                    }}
                    transition={{
                        duration: 3,
                        ease: "easeOut"
                    }}
                    className="absolute text-6xl"
                >
                    {emoji}
                </motion.div>
            ))}
        </div>
    );
};

export const EmojiEffectHandler: React.FC = () => {
    const [activeEmoji, setActiveEmoji] = useState<string | null>(null);
    const [isEffectActive, setIsEffectActive] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleEmojiEffect = (emoji: string) => {
            setActiveEmoji(emoji);
            setIsEffectActive(true);
        };

        socket.on('emoji-effect', handleEmojiEffect);

        return () => {
            socket.off('emoji-effect', handleEmojiEffect);
        };
    }, [socket]);

    const handleEffectComplete = useCallback(() => {
        setIsEffectActive(false);
        setActiveEmoji(null);
    }, []);

    return activeEmoji ? (
        <EmojiExplosion
            emoji={activeEmoji}
            isActive={isEffectActive}
            onComplete={handleEffectComplete}
        />
    ) : null;
};