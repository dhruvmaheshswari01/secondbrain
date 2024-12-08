import axios from "axios";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { useRef } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signin(){
    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const navigate = useNavigate();

    async function signin(){
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }
        try {
            const response = await axios.post(BACKEND_URL+"/api/v1/signin",{
                username,
                password
            });
            const jwt=response.data.token;
            localStorage.setItem("token",jwt); 
            navigate("/dashboard");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert("Wrong credentials");
            } else {
                alert("An unexpected error occurred.");
            }
        }
    }
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-4">
            <Input reference={usernameRef} placeholder="Username" />
            <Input reference={passwordRef} placeholder="Password" />
            <div className="flex justify-center my-2"> 
                <Button onClick = {signin} loading={false} fullWidth={true} variant="primary" text="SignIn"/>
            </div>
        </div>
    </div>
}