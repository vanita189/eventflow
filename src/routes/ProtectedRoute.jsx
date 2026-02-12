import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {Navigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) =>{
    const {user,loading} = useAuth();

if (loading) {
    return <div>Loading...</div>; // ✅ never return null
  }

    if(!user) {
        return <Navigate to="/" replace/>
    }
    
   

    return children ;
}

export default ProtectedRoute;