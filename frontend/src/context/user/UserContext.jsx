import React, { createContext, useContext, useState, useEffect } from "react"
import axios from "axios";
import UserProvider from "./UserContext_v1";

//CONTEXT CREATION
export const UserContext = createContext();



export function useUserData() {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error("useUserDetails must be used within a provider")
    }
    return context;
}

// Define Provider
export function UserServices ({ children }) {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

    const initialUserDetails = {
        email: "", 
        username: "",
        available_funds: "0.00",
        profile_picture: `${MEDIA_URL}/user/default/account.png`,
    };

    const [userData, setUserData] = useState(initialUserDetails);
    const [isLoading, setIsLoading] = useState(true);


    // Function to fetch user data
    const fetchUserData = async () => {
        setIsLoading(true);
        const userID = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");

        if (!userID || !accessToken) {
            setIsLoading(false);
            return { success: false, error: "User Id or access toke is missing"};
        };

        try {
            const response = await axios.get(`${BASE_URL}/users/${userID}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const userData = response.data;
            setUserData(userData)
            console.log("TESting user DATA from func call", userData)
            setIsLoading(false)
            return { success: true, data: response.data };   
        } catch (error) {
            setIsLoading(false);
            return { success: false, error: error.message }; 
        }
    };

    // useEffect to fetch user data when the components moutns
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
export default UserServices;
