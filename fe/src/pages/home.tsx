import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";

export function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="h-screen w-screen bg-gray-100 flex flex-col justify-center items-center">

            <h1 className="text-4xl font-bold text-purple-600 mb-8">Second Brain</h1>
            
            <div className="flex gap-4">
            
                <Button
                    variant="primary"
                    text="Sign Up"
                    onClick={() => navigate("/signup")}
                />
                
                
                <Button
                    variant="secondary"
                    text="Sign In"
                    onClick={() => navigate("/signin")}
                />
            </div>
        </div>
    );
}
