import React from "react";

export const Container = ({ children, className = "overflow-auto" }) => {
    return (
        <div className={`flex-1 w-full min-h-0 flex flex-col surface-card p-4 md:p-5 ${className}`}>
            {children}
        </div>
    );
};
