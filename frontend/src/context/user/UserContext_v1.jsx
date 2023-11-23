// import React, { createContext, useContext } from "react";
// import { useUserServices } from "./UserServices_v1";

// // --- CONTEXT CREATION ---
// // Create a new context for user-related operations. This will allow us to share 
// // user-related data/functions across our components.
// export const UserContext = createContext({
//   // Default placeholder methods for obtaining and updating user details.
//   // These will be overridden by actual methods when the context's value is set.
//   fetchUserDetails: async () => {},
//   updateUserDetails: async () => {},
//   useUserDetails: {}, 
// });

// // --- CUSTOM HOOK: useUserDetails ---
// // Custom hook to easily access the user context.
// export function useUserDetails() {
//     // Retrieve the current value of the UserContext.
//     const context = useContext(UserContext);

//     // If the hook is used outside of the UserProvider component (i.e., context is undefined),
//     // throw an error to inform developers of incorrect usage.
//     if (!context) {
//         throw new Error("useUserDetails must be used within a UserProvider");
//     }
    
//     // Return the user-related data/functions from the context.
//     return context;
// }

// // --- COMPONENT: UserProvider ---
// // Component that wraps parts of our app to provide them access to the UserContext.
// export function UserProvider({ children }) {
//   // Log a message every time the UserProvider is rendered. Useful for debugging.
//   console.log("UserProvider rendered");

//   // Call the custom hook `useUserServices` to get user-related services.
//   const userServices = useUserServices();

//   // Return the UserContext.Provider component. This component provides its children
//   // access to the context. Here, we're setting the context's value to the user
//   // services we obtained from the `useUserServices` hook.
//   return (
//     <UserContext.Provider value={userServices}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserProvider;

// Accessing services from the useUserServices hook

// import { useUserServices } from './useUserServices';

// const MyComponent = () => {
//     const { userDetails, getUserDetails } = useUserServices();
//     // Use userDetails, getUserDetails, etc.
// }


