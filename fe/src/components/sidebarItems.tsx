import { ReactElement } from "react";

interface SidebarItemProps {
    title: string;
    icon: ReactElement;
    onClick: () => void; // Click handler
}

export function SidebarItems({ title, icon, onClick }: SidebarItemProps) {
    return (
        <div
            className="flex text-gray-800 py-2 cursor-pointer hover:bg-gray-200 transition-all duration-150"
            onClick={onClick} // Trigger onClick when clicked
        >
            <div className="px-2">{icon}</div>
            <div>{title}</div>
        </div>
    );
}