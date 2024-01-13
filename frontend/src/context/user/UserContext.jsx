import React, { createContext, useContext, useState, useEffect } from "react"
import useCrud from "../../services/useCrud";

//CONTEXT CREATION
export const UserContext = createContext();



export function useUserServices() {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error("useUserDetails must be used within a provider")
    }
    return context;
}

// Define Provider
export function UserServiceProvider ({ children }) {

    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

    const initialUserDetails = {
        email: "", 
        username: "",
        available_funds: "0.00",
        profile_picture: `${MEDIA_URL}/user/default/account.png`,
    };

    const [userData, setUserData] = useState(initialUserDetails);
    const [isLoading, setIsLoading] = useState(true);

    const { fetchData } = useCrud()

    // Function to fetch user data
    const fetchUserData = async () => {
        setIsLoading(true);
        const userID = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");

        if (!userID) {
            setIsLoading(false);
            return { success: false, error: "User Id is missing"};
        };

        try {
            const userData = await fetchData(`/users/${userID}`)
            setUserData(userData)
            console.log("TESting user DATA from func call", userData)
            setIsLoading(false)
            return { success: true, data: userData };   
        } catch (error) {
            setIsLoading(false);
            return { success: false, error: error.message }; 
        }
    };

    // let updateUserData = response.data;


    // useEffect to fetch user data when the components mounts
    useEffect(()=>{
        fetchUserData();
    },[])

    const value = {
        userData,
        fetchUserData,
    };

    return(
        <UserContext.Provider value={value} >
            { children }
        </UserContext.Provider>
    )

}
export default UserServiceProvider;
