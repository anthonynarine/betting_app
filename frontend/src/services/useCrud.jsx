import { useState, useCallback } from "react";
import useAxiosWithInterceptor from "./jwtinterceptor-jwtNotReq";
import useAxiosWithInterceptorJwt from "./jwtinterceptor-jwtReq";

// Accessing this hoook in a component.
// Import

const useCrud = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const jwtAxios = useAxiosWithInterceptor();
  const jwtReqAxios = useAxiosWithInterceptorJwt();
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    async (url, accessToken) => {
      setIsLoading(true);
      try {
        if (!BASE_URL) {
          throw new Error("BASE_URL is not defined");
        }
        // Set the authorization header only if an access token is provided
        if (accessToken) {
          jwtAxios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        }

        const response = await jwtAxios.get(`${BASE_URL}${url}`);
        const data = response.data;
        // console.log("API Data:", data);  //TEST
        setApiData(data);
        setError(null);
        setIsLoading(false);
        return data;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setError(new Error("400"));
          console.error(error);
        }
        console.error("Error:", error);
        setIsLoading(false);
        throw error;
      }
    },
    [jwtAxios, BASE_URL]
  );

  const createObject = async (url, data) => {
    setIsLoading(true);
    try {
      const response = await jwtReqAxios.post(url, data);
      const createdData = response.data;
      setApiData([...apiData, createdData]); // Add the created data to the list
      setError(null);
      setIsLoading(false);
      return createdData;
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      throw error;
    }
    // EXAMPLE USING THIS FUNCTION
    // createData('/groups/', groupData)
    // createData('/events/', eventData)
  };

/**
 * Asynchronously updates an object on the server.
 * 
 * @param {string} url - The base URL of the API endpoint.
 * @param {number|string} id - The unique identifier of the object to be updated.
 * @param {Object} data - The new data for the object.
 * 
 * This function constructs the full URL by appending the object's id to the base URL,
 * then makes a PUT request to the server with the new data. If the request is successful,
 * it updates the local state `apiData` with the new object data. In case of an error,
 * it captures and sets the error state.
 * 
 * The function uses axios (jwtReqAxios) for making the HTTP request. It assumes that
 * `jwtReqAxios` is an axios instance configured for authorization (e.g., with JWT).
 * 
 * The function also manages loading and error states, useful for UI feedback.
 */
const updateObject = async (url, id, data) => {
  setIsLoading(true); // Start loading state
  try {
    // Debugging logs
    console.log('URL:', url); 
    console.log('ID:', id);
    const fullUrl = `${url}${id}/`; // Construct the full URL
    console.log('Full URL:', fullUrl);

    const response = await jwtReqAxios.put(fullUrl, data); // Make the PUT request
    const updatedData = response.data; // Extract updated data from response

    // Update local state with the new data
    setApiData(apiData.map(item => item.id === id ? updatedData : item));

    setError(null); // Reset any previous errors
    setIsLoading(false); // End loading state
    return updatedData; // Return the updated object
  } catch (error) {
    console.error("Error updating object", error); // Log the error
    setError(error); // Set error state
    setIsLoading(false); // End loading state
    throw error; // Re-throw the error for further handling
  }
};

  const deleteObject = async (url, id) => {
    setIsLoading(true);
    try {
      const fullUrl = `${url}${id}/`;
      await jwtReqAxios.delete(fullUrl)
      console.log("Data Before delete")
      setApiData(currentApiData => currentApiData.filter(item => item.id !== id));
      setError(null)
    } catch (error) {}
  };

  return {
    apiData,
    error,
    isLoading,
    fetchData,
    createObject,
    updateObject,
    deleteObject,
  };
};

export default useCrud;
