import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Card } from "../components/card";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter",
}

interface SharedContent {
    username: string;
    content: Array<{
        title: string;
        type: ContentType;
        link: string;
        _id:string;
    }>;
}

export function SharedDashboard() {
    const { shareLink } = useParams<{ shareLink: string }>();
    const [data, setData] = useState<SharedContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/brain/${shareLink}`);
                setData(response.data);
            } catch (err) {
                setError("Unable to load shared dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [shareLink]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 min-h-screen bg-gray-100">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-purple-600">
                    {data?.username}'s Shared Dashboard
                </h1>
            </div>
            <div className="flex gap-4 flex-wrap">
                {data?.content.map(({ title, type, link,_id }) => (
                    <Card id={_id} key={_id} type={type} link={link} title={title} onDelete={()=>{}} />
                ))}
            </div>
        </div>
    );
}
