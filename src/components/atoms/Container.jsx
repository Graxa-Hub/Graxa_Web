import React from "react";

export const Container = ({ children }) => {
    return (
        <div className="flex-1 w-full min-h-0 overflow-auto">
            <div className="flex flex-col h-full">
                {children}
            </div>
        </div>
    );
};
