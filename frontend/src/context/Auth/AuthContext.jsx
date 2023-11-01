// --- IMPORTS ---
import { createContext, useContext } from "react";
import { useAuthServices } from "./AuthServices";



// --- CONTEXT CREATION ---
// Create a new context for authentication. This will allow us to share 
// authentication-related data/functions across our components.
const AuthContext = createContext({
  // Default placeholder methods are provided in case they are not overridden 
  // by actual methods when the context's value is set.

  // For user registration
  signup: async (username, email, password, confirmPassword) => {},

  // For requesting tokens
  obtainTokens: async (email, password) => {},

  // For extracting user ID from the token
  getUserIdFromToken: (access) => {},

  // For obtaining user details
  getUserDetails: async () => {},
});



// --- CUSTOM HOOK: useAuth ---
// Custom hook to EASILY ACCESS the authentication context.
export function useAuth() {
  // Retrieve the current value of the AuthContext.
  const context = useContext(AuthContext);

  // If the hook is used outside of the AuthProvider component (i.e., context is undefined),
  // throw an error to inform developers of incorrect usage.
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Return the authentication-related data/functions from the context.
  return context;
}



// --- COMPONENT: AuthProvider ---
// Component that wraps parts of our app to provide them access to the AuthContext.
export function AuthProvider({ children }) {
  // Log a message every time the AuthProvider is rendered. Useful for debugging.
  console.log("AuthProvider rendered");

  // Call the custom hook `useAuthServices` to get services provided .
    const authServices = useAuthServices();

  // Return the AuthContext.Provider component. This component provides its children
  // access to the context. Here, we're setting the context's value to the authentication
  // services we obtained from the `useAuthServices` hook.
  return (
    <AuthContext.Provider value={authServices}>
      {children}
    </AuthContext.Provider>
  );
}



// --- EXPORTS ---
// Export the AuthProvider component as the default export for this module.
export default AuthProvider;





