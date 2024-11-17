import React from "react";

export const Badge = ({
    children,
    classname = "",
    variant = "outline",
}: {
    children: React.ReactNode;
    classname?: string;
    variant?: string;
}) => {
    return (
        <span className={`badge ${variant} ${classname}`}>
            {children}
        </span>
    );
};
