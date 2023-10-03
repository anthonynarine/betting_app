import { createContext, useContext } from "react";

export const LoginContext = createContext({
    login: () => {},
    logout: () => {}
});


export function useLogin() {
    const context = useContext(LoginContext);

    if (!context) {
        throw new Error("useLogin must be used within a LoginProvider");
    }
  
    return context;
}