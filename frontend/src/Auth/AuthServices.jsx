import axios from "axios";

export function useAuthServices() {
  const BASE_URL = "http://127.0.0.1:8000";
  // new user registration
  const signup = async (username, email, password, confirmPassword) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/signup/`,
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
  const obtainTokens = async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/token/`, {
        username,
        password,
      });

      const { access, refresh } = response.data;

      console.log("Data returned by obtainTokens():", response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Extract the user_id from the token
  const getUserIdFromToken = (access) => {
    try {
      const token = access;
      // Split the token into its components (header, payload, signature)
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token structure");
      }

      // Decode the payload
      const decodedPayload = atob(tokenParts[1]);

      // Parse the payload
      const payloadData = JSON.parse(decodedPayload);
      const userId = payloadData.user_id;

      return userId;
    } catch (error) {
      console.error("Error extracting user ID from token:", error.message);
      return null;
    }
  };
  // Use the userId in localstorage to get get the username
  const getUserDetials = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("API Response:", response.data);
      const userDetails = response.data;
      console.log("User Details:", userDetails);
      const username = userDetails.username;
      console.log("Extracted Username:", username);
      localStorage.setItem("username", username);
    } catch (error) {
      console.log("Error obtaining user details:", error.message);
      return error;
    }
  };

  return {
    signup,
    obtainTokens,
    getUserIdFromToken,
    getUserDetials,
  };
}
