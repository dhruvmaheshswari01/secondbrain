import {  useState } from 'react';
import { Button } from '../components/button'
import { Card } from '../components/card';
import { PlusIcon } from '../icons/plusIcon';
import { CreateComponent } from '../components/createComponent';
import { Sidebar } from '../components/sidebar';
import { useContent } from '../hooks/userContent';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { ShareIcon } from '../icons/shareIcon';
import { ContentItem } from '../hooks/userContent';

export function Dashboard(){
    const [modalOpen,setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const content = useContent();

    const handleDelete = async (id: string) => {
        try {
            // Send delete request to the backend
            await axios.delete(`${BACKEND_URL}/api/v1/content`, {
                data: { contentId: id }, // Send contentId in the request body
                headers: {
                    "Authorization": localStorage.getItem("token"),
                }
            });

            // Refresh content after deletion
            alert("Content deleted successfully");
            //refresh(); // Refresh the content list after deletion
        } catch (error) {
            console.error("Error deleting content:", error);
            alert("Failed to delete content");
        }
    };
    const filteredContent = content.filter(
        (item: ContentItem) =>
            selectedCategory === "All" || item.type === selectedCategory
    );
    return (
        <div>
            <div>
            <Sidebar onCategorySelect={setSelectedCategory} />
            </div>
            <div className='p-4 ml-72 min-h-screen bg-gray-100 border-2'>
            <CreateComponent open={modalOpen} onClose={()=>{
            setModalOpen(false)
            }}/>
            <div className='flex justify-end gap-4'>
                <Button onClick  ={()=>{
                    setModalOpen(true);
                }} startIcon={<PlusIcon/>} variant='primary' text='Add'/>

                <Button onClick={
                    async () => {
                        const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                            share: true,
                        },{
                            headers: {
                                "Authorization": localStorage.getItem("token")
                              }
                        });
                        const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
                        alert(shareUrl);
                } }startIcon={<ShareIcon/>} variant='secondary' text='Share'/>
            </div>
            <div className='flex gap-4 flex-wrap mt-3'>
            {filteredContent.map(({ _id, title, type, link }) => (
                        <Card
                            key={_id}
                            id={_id}
                            type={type}
                            link={link}
                            title={title}
                            onDelete={handleDelete} // Pass the onDelete handler to Card
                        />
            ))}
            </div>
            </div>
        </div>
    )
}