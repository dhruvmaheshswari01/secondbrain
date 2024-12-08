import { useRef, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Close } from "../icons/close";

export function CreateComponent({open,onClose}:{open:boolean,onClose?:()=>void}){
    enum ContentType{
        Youtube="youtube",
        Twitter="twitter"
    }

    const titleRef = useRef<HTMLInputElement>();
    const LinkRef = useRef<HTMLInputElement>();
    const [type,setType] =useState(ContentType.Youtube);


    async function addContent(){
        const title = titleRef.current?.value;
        const link = LinkRef.current?.value;
        await axios.post(`${BACKEND_URL}/api/v1/content`,{
            link,
            title,
            type
        },{
            headers:{
                "Authorization":localStorage.getItem("token")
            }
        })
        if (onClose) {
            onClose();
        }
    }
    return <div>
        {
            open && <div>
                <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center">
                </div>
                <div className="w-screen h-screen fixed top-0 left-0  flex justify-center">
                    <div className="flex flex-col justify-center">
                        <span className="bg-white opacity-100 p-4 rounded">
                            <div className="flex justify-end">
                                <div onClick={onClose} className="cursor-pointer">
                                <Close/>
                                </div>
                            </div>
                            <div>
                                <Input reference={titleRef} placeholder={"Title"}/>
                                <Input reference={LinkRef} placeholder={"Link"}/>
                            </div>
                            <div className="flex justify-center mb-3 gap-1 p-2">
                                <Button text="Yt" variant={type===ContentType.Youtube?"primary":"secondary"} onClick={()=>
                                    setType(ContentType.Youtube)
                                }/>
                                <Button text="X" variant={type===ContentType.Twitter?"primary":"secondary"} onClick={()=>
                                    setType(ContentType.Twitter)
                                }/>
                            </div>
                            <div className="flex justify-center ">
                                <Button onClick={addContent} variant="primary" text="Submit"/>
                            </div>
                        </span>
                    </div>
                </div>

            </div>
        }
    </div>

}
