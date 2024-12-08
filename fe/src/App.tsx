import { Dashboard } from "./pages/dashboard";
import { Signup } from "./pages/signup";
import { Signin } from "./pages/signin";
import { Route,Routes,BrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/home";
import { SharedDashboard } from "./pages/shared";


function app(){
    return <BrowserRouter>
        <Routes>
            <Route path="signup" element={<Signup/>}/>
            <Route path="signin" element={<Signin/>}/>
            <Route path="dashboard" element={<Dashboard/>}/>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/share/:shareLink" element={<SharedDashboard/>}/>
        </Routes>
    </BrowserRouter>
}
export default app;