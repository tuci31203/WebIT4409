import React, { ReactNode, useState } from "react";

// Interface for Popover
interface PopoverProps {
    children: ReactNode;
}

// Interface for PopoverTrigger
interface PopoverTriggerProps {
    children: ReactNode;
    onClick?: () => void;
}

// Interface for PopoverContent
interface PopoverContentProps {
    children: ReactNode;
    className?: string;
    side?: "top" | "bottom" | "left" | "right"; // Optional placement
    sideOffset?: number; // Optional offset
}

// Popover Component
export const Popover = ({ children }: PopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {children}
        </div>
    );
};

// PopoverTrigger Component
export const PopoverTrigger = ({ children, onClick }: PopoverTriggerProps) => {
    return (
        <button
            className="popover-trigger"
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// PopoverContent Component
export const PopoverContent = ({
    children,
    className = "",
    side = "bottom",
    sideOffset = 0,
}: PopoverContentProps) => {
    // Determine placement based on 'side' and 'sideOffset'
    const getPlacementStyles = () => {
        const styles: React.CSSProperties = {
            position: "absolute",
        };
        if (side === "top") styles.bottom = `calc(100% + ${sideOffset}px)`;
        if (side === "bottom") styles.top = `calc(100% + ${sideOffset}px)`;
        if (side === "left") styles.right = `calc(100% + ${sideOffset}px)`;
        if (side === "right") styles.left = `calc(100% + ${sideOffset}px)`;
        return styles;
    };

    return (
        <div
            className={`popover-content bg-white shadow-md border p-2 rounded ${className}`}
            style={getPlacementStyles()}
        >
            {children}
        </div>
    );
};
