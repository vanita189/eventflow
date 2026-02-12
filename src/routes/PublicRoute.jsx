import {useContext} from "react";
import {Navigate} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext);

if (loading) {
    return <div>Loading...</div>; // ✅ never return null
  }

    if(user) {
        return <Navigate to="/Dashboardlayout" replace />
    }

    return children;
}

export default PublicRoute;