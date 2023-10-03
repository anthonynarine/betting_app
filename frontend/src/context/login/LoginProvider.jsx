// LoginProvider.js
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginContext } from "./LoginContext";

export const LoginProvider = ({ children }) => {

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const [isLoggedIn, setIsLoggedIn] = useState(loggedIn)

    const navigate = useNavigate();

    const login = () => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/login")
    };

    const logout = () => {
        setIsLoggedIn(false);
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userId")
        localStorage.removeItem("username")
        navigate("/login")

    };

    return (
        <LoginContext.Provider value={{ login, logout, isLoggedIn, setIsLoggedIn }}>
            {children}
        </LoginContext.Provider>
    );
};
