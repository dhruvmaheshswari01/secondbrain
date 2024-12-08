import { ArrowUpRight } from "../icons/arrowupright";
import { BarIcon } from "../icons/bar";
import { Trash } from "../icons/trash";

interface cardProps {
    id: string;
    title: string;
    link: string;
    type: "twitter" | "youtube";
    onDelete: (id: string) => void;
}

export function Card(props:cardProps){
    const handleDelete = () => {
        props.onDelete(props.id); // Call the onDelete function passed from the parent
    }
    return <div>
        <div className="p-4 bg-white rounded-md border-gray-200 max-w-72 border min-h-48 min-w-72">
            <div className="flex justify-between">
                <div className="flex items-center text-md font-bold">
                    <div className="text-gray-500 pr-2">
                       <BarIcon/>
                    </div>
                    {props.title}
                </div>
                <div className="flex items-center">
                    <div className="pr-2 text-gray-500 cursor-pointer">
                        <a href={props.link} target="_blank"><ArrowUpRight/></a>
                    </div>
                    <div className="pr-2 text-gray-500 cursor-pointer" onClick={handleDelete}>
                        <Trash/>
                    </div>
                </div>
            </div>
            <div className="pt-4">
                {props.type=="youtube"&&<iframe className="w-full" src={props.link.replace("watch","embed").replace("?v=","/")} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}
                {props.type=="twitter"&&<blockquote className="twitter-tweet">
                <a href={props.link.replace("x.com","twitter.com")}></a> 
                </blockquote>}
            </div>
        </div>
    </div>
}