// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export const useUserServices = () => {
//   const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

//   const initialUserDetails = {
//     email: "",
//     username: "",
//     available_funds: "0.00",
//     profile_picture: `${MEDIA_URL}/user/default/account.png`,
//   };

//   const [userDetails, setUserDetails] = useState(initialUserDetails);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchUserDetails = async () => {
//     setIsLoading(true);
//     const userId = localStorage.getItem("userId");
//     const accessToken = localStorage.getItem("accessToken");

//     if (!userId || !accessToken) {
//       setIsLoading(false);
//       return { success: false, error: "User ID or access token missing" };
//     }

//     try {
//       const response = await axios.get(`${BASE_URL}/users/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       const userData = response.data;
//       console.log("User DATA in FetchUserDetails function", userData);
//       setUserDetails(userData);
//       console.log(
//         "User DATA in FetchUserDetails function after setter function",
//         userDetails
//       );
//       setIsLoading(false);
//       return { success: true, data: response.data };
//     } catch (error) {
//       console.log("Error obtaining user data:", error.message);
//       setIsLoading(false);
//       return { success: false, error: error.message };
//     }
//   };

//   // Use a useEffect  to log userDetails when it changes
//   useEffect(() => {
//     console.log("userDetails state in useUserServices:", userDetails);
//   }, [userDetails]);

//   const updateUserDetails = async () => {
//     setIsLoading(true);
//     try {
//       const updatedUserDetails = await fetchUserDetails();
//       if (updatedUserDetails.success) {
//         setUserDetails(updatedUserDetails.data);
//       } else {
//         // Handle the case where fetching user details was not successful
//         console.error("Failed to fetch user details:", updatedUserDetails.error);
//       }
//     } catch (error) {
//       // Handle any errors that occur during the fetch
//       console.error("Error fetching user details:", error);
//     } finally {
//       setIsLoading(false); // Reset loading state
//     }
//   };

//   return {
//     userDetails,
//     fetchUserDetails,
//     updateUserDetails,
//   };
// };
