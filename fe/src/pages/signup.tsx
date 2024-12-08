import { useRef } from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup(){
    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const navigate = useNavigate();

    async function signup(){
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }
        try {
            await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
            });
            alert("You have signed up!");
            navigate("/signin");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    alert("User already exists. Please sign in or use a different username.");
                } else {
                    alert("An error occurred. Please try again later.");
                }
            } else {
                alert("An unexpected error occurred.");
            }
        }
    }
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-4">
                <Input reference={usernameRef} placeholder="Username"/>
                <Input reference={passwordRef} placeholder="Password"/>
            <div className="flex justify-center my-2"> 
                <Button onClick={signup} loading={false} fullWidth={true} variant="primary" text="SignUp"/>
            </div>
        </div>
    </div>
}