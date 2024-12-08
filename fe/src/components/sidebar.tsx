import { SidebarItems } from "./sidebarItems";
import { TwitterIcon } from "../icons/twitterIcon";
import { YtIcons } from "../icons/ytIcon";
import { LogoIcon } from "../icons/logoIcon";
import { All } from "../icons/all";

interface SidebarProps {
    onCategorySelect: (category: string) => void; // Callback for category selection
}

export function Sidebar({ onCategorySelect }: SidebarProps) {
    return (
        <div className="h-screen bg-white border-r w-72 fixed left-0 top-0 pl-4">
            <div className="pt-8">
                <div className="flex">
                    <div className="pr-3 text-purple-600">
                        <LogoIcon />
                    </div>
                    <h1 className="flex text-2xl text-purple-600 pb-10">Second Brain</h1>
                </div>
                <SidebarItems title="Twitter" icon={<TwitterIcon />} onClick={() => onCategorySelect("twitter")} />
                <SidebarItems title="YouTube" icon={<YtIcons />} onClick={() => onCategorySelect("youtube")} />
                <SidebarItems title="All" icon={<All/>} onClick={() => onCategorySelect("All")} />
            </div>
        </div>
    );
}