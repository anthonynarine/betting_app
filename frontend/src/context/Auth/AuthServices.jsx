import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export function useAuthServices() {

  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [isLoggedIn,  setIsLoggedIn] = useState(loggedIn)

  // new user registration
  const signup = async (username, email, password, confirmPassword) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/signup/`,
        {
          username,
          email,
          password,
          password2: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Signup Success Response:", response);
      return { status: response.status, data: response.data };
    } catch (error) {
      console.error("Signup Error Response:", error.response);
      return { status: error.response.status, error: error.response.data };
    }
  };

  // Request tokens
  const obtainTokens = async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/token/`, {
        email,
        password,
      });

      console.log("Data returned by obtainTokens():", response.data);

      const { access, refresh } = response.data;

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Extract the user_id from the token
  const getUserIdFromToken = (access) => {

    // Attempt to extract user ID from the provided JWT.
    try {

        // Assign the provided JWT to a constant
        const token = access;

        // A JWT consists of three parts: header, payload, and signature. 
        // These parts are separated by periods ('.').
        // This line splits the token into its three individual components.
        const tokenParts = token.split(".");

        // Check if the token has the correct number of parts (i.e., 3).
        // If not, it's considered invalid.
        if (tokenParts.length !== 3) {
            throw new Error("Invalid token structure");
        }

        // The payload of the JWT (which is the second part) is Base64Url encoded.
        // This line decodes the payload to get the actual content.
        const decodedPayload = atob(tokenParts[1]);

        // After decoding, the payload is still in a stringified JSON format.
        // This line parses it to convert it into a JavaScript object.
        const payloadData = JSON.parse(decodedPayload);

        // Extract the user ID from the parsed payload.
        const userId = payloadData.user_id;

        // Return the extracted user ID.
        return userId;

    } catch (error) {
        // Log any errors encountered during the process.
        console.error("Error extracting user ID from token:", error.message);
        
        // Return null in case of an error.
        return null;
    }
};

const login = () => {
  setIsLoggedIn(true);
  localStorage.setItem("isLoggedIn", "true");
};

  // Use the userId in localstorage to get the user's email field
  const getUserDetails = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("API Response:", response.data);
      const userDetails = response.data;
      console.log("User Details:", userDetails);
      const userEmail = userDetails.email;
      console.log("User Email:", userEmail);
      localStorage.setItem("email", userEmail);
    } catch (error) {
      console.log("Error obtaining user details:", error.message);
      return error;
    }
  };

  const initialUserDetials = {
    email: "",
    username: "",
    availabel_funds: "0.00",
    profile_picture: `${MEDIA_URL}/user/default/account.png`
  };

  // State for user details
  const [userDetails, setUserDetials] = useState(initialUserDetials);

  //Func to update user details
  const updateUserDetial = async () =>{
    const updatedUserDetials = await getUserDetails();
    setUserDetials(updatedUserDetials)
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userId")
    localStorage.removeItem("email")
    navigate("/login")

};

  return {
    signup,
    obtainTokens,
    getUserIdFromToken,
    setIsLoggedIn,
    isLoggedIn,
    login,
    getUserDetails,
    updateUserDetial,
    userDetails,
    logout
  };
}
