import { Navigate } from "react-router-dom";
import { useAuthServices } from "./AuthServices";


const ProtectedRoute = ({ children }) => {

    const { isLoggedIn } = useAuthServices();

    if(!isLoggedIn) {
        return <Navigate to={"/login"} />;
    }
    return <>
        {children}
    </>
};
export default ProtectedRoute;