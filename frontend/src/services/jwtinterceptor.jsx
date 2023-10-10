// Import necessary dependencies
import axios from "axios";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

/**
 * useAxiosWithInterceptor is a custom hook that wraps the Axios instance
 * with an interceptor to handle 401 and 403 errors by attempting to refresh
 * the token. If refreshing the token fails, it redirects the user to the
 * home page, and if there's no refresh token, it redirects the user to the 
 * login page.
 *
 * @returns {object} An Axios instance with the interceptor applied.
 */
const useAxiosWithInterceptor = () => {

  // Get the base URL from the config
  const API_BASE_URL = BASE_URL;

  const navigate = useNavigate();


  // Create a new Axios instance with the base URL
  const jwtAxios = axios.create({ baseURL: API_BASE_URL });


  // Add the response interceptor to the Axios instance
  jwtAxios.interceptors.response.use(
    (response) => {
      // If the response is successful, simply return it
      return response;
    },
    async (error) => {

      // Store the original request configuration
      const originalRequest = error.config;
      console.log("Error Request Config:", originalRequest);

      // Check if the error response status is 401 (Unauthorized) or 403 (Forbidden)
      if (error.response?.status === 401 || error.response?.status === 403) {

        // Retrieve the refresh token from local storage
        const refreshToken = localStorage.getItem("refreshToken");

        
        if (refreshToken) {
          try {

            // Attempt to get a new access token using the refresh token
            const refreshResponse = await axios.post(
              "http://127.0.0.1:8000/api/token/refresh/",
              {
                refresh: refreshToken,
              }
            );         
            // Extract the new access token from the response
            const newAccessToken = refreshResponse.data.access;

            // Store the new access token in local storage
            localStorage.setItem("accessToken", newAccessToken);


            // Set the new token in the original request's authorization header
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

            // Retry the original request with the new access token
            return jwtAxios(originalRequest);

          } catch (refreshError) {

            // If refreshing the token fails, log the error, navigate to home, and throw the error
            console.error("Refresh token request failed: ", refreshError);
            navigate("/");
            throw refreshError;
          }

        } else {

          // If there's no refresh token in local storage, navigate the user to the login page
          navigate("/login");
        }
      }
      
      // If the error wasn't handled above, simply throw it so it can be caught elsewhere
      throw error;
    }
  );
  // Return the Axios instance with the interceptor applied
  return jwtAxios;
};

export default useAxiosWithInterceptor;
