/* eslint-disable no-lone-blocks */
import { useState, useCallback } from "react";
import useAxiosWithInterceptor from "./jwtinterceptor-jwtNotReq";
import useAxiosWithInterceptorJwt from "./jwtinterceptor-jwtReq";

{/*custom React hook designed for CRUD (Create, Read, Update, Delete)
operations in applications interacting with a backend server. It
encapsulates API interaction logic, manages API data, loading 
states, and error handling. The hook leverages a modified Axios 
instance with interceptors, which includes built-in token refresh 
logic for handling JWT (JSON Web Token) authorization.*/}


const useCrud = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const jwtAxios = useAxiosWithInterceptor();
  const jwtReqAxios = useAxiosWithInterceptorJwt();
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

/**
 * Asynchronously fetches data from a given API endpoint.
 * 
 * @param {string} url - The relative URL of the API endpoint to fetch data from.
 * @param {string} [accessToken] - Optional access token for authorization.
 * 
 * This function constructs the full URL by appending the relative URL to the BASE_URL.
 * If an access token is provided, it sets the Authorization header for the axios instance.
 * It then makes a GET request to the server. If successful, it updates the local state `apiData`
 * with the fetched data. In case of an error, it captures and sets the error state.
 * 
 * The function uses axios (jwtAxios) for making the HTTP request. It checks if BASE_URL is defined,
 * and throws an error if not.
 * 
 * Manages loading and error states, which is useful for UI feedback.
 * 
 * Example Usage:
 * To fetch data from an endpoint '/groups/', with or without an access token:
 *   fetchData('/groups/', accessToken); // accessToken is optional
 * 
 * Note: This function is wrapped with useCallback to memoize it based on dependencies [jwtAxios, BASE_URL].
 * This is useful when passing this function as a prop to React components or when it needs to be stable across re-renders.
 */
const fetchData = useCallback(
  async (url, accessToken) => {
    setIsLoading(true); // Start loading state
    try {
      if (!BASE_URL) {
        throw new Error("BASE_URL is not defined");
      }
      // Set the authorization header only if an access token is provided
      if (accessToken) {
        jwtAxios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await jwtAxios.get(`${BASE_URL}${url}`); // Make the GET request
      const data = response.data; // Extract data from response

      setApiData(data); // Update local state with the fetched data

      setError(null); // Reset any previous errors
      setIsLoading(false); // End loading state
      return data; // Return the fetched data
    } catch (error) {
      // Specific error handling for 400 status
      if (error.response && error.response.status === 400) {
        setError(new Error("400"));
        console.error(error);
      }
      console.error("Error:", error); // Log other errors
      setIsLoading(false); // End loading state
      throw error; // Re-throw the error for further handling
    }
  },
  [jwtAxios, BASE_URL] // Dependencies for useCallback
);


/**
 * Asynchronously creates a new object on the server.
 * 
 * @param {string} url - The URL of the API endpoint where the object will be created.
 * @param {Object} data - The data for the new object to be created.
 * 
 * This function makes a POST request to the specified URL with the provided data.
 * If the request is successful, it updates the local state `apiData` with the newly
 * created object. In case of an error, it captures and sets the error state.
 * 
 * The function uses axios (jwtReqAxios) for making the HTTP request. It assumes that
 * `jwtReqAxios` is an axios instance configured for authorization (e.g., with JWT).
 * 
 * Manages loading and error states, which is useful for providing UI feedback.
 * 
 * Example Usage:
 * createObject('/groups/', groupData)
 * createObject('/events/', eventData)
 */
const createObject = async (url, data) => {
  setIsLoading(true); // Start loading state
  try {
    const response = await jwtReqAxios.post(url, data); // Make the POST request
    const createdData = response.data; // Extract created data from response

    setApiData([...apiData, createdData]); // Add the created data to the existing list

    setError(null); // Reset any previous errors
    setIsLoading(false); // End loading state
    return createdData; // Return the newly created object
  } catch (error) {
    console.error("Error:", error); // Log the error
    setError(error); // Set error state
    setIsLoading(false); // End loading state
    throw error; // Re-throw the error for further handling
  }
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
 * Manages loading and error states, which is useful for UI feedback.
 * 
 * Example Usage:
 * Assume you have an existing group with an id of 123, and you want to update its data.
 * Let's say `updatedGroupData` is the new data for the group:
 *   const updatedGroupData = {
 *     name: "Updated Group Name",
 *     description: "Updated description",
 *     members: [789, 101]
 *   };
 * To update this group, call the function with the API endpoint, the group's id, and the new data:
 *   updateObject('/groups/', 123, updatedGroupData);
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


/**
 * Asynchronously deletes an object on the server.
 * 
 * @param {string} url - The base URL of the API endpoint.
 * @param {number|string} id - The unique identifier of the object to be deleted.
 * 
 * This function constructs the full URL by appending the object's id to the base URL,
 * then makes a DELETE request to the server. If the request is successful, it updates
 * the local state `apiData` by removing the deleted object. 
 * 
 * The function uses axios (jwtReqAxios) for making the HTTP request.
 * 
 * Manages loading state, which is useful for UI feedback. In case of an error during
 * the delete operation, appropriate error handling can be implemented.
 * 
 * Example Usage:
 * To delete an object with a specific id from an endpoint '/groups/':
 *   deleteObject('/groups/', 123);
 * 
 * Note: The function currently lacks error handling in the catch block. It's recommended
 * to add appropriate error handling logic and possibly update the UI state accordingly.
 */
const deleteObject = async (url, id) => {
  setIsLoading(true); // Start loading state
  try {
    const fullUrl = `${url}${id}/`; // Construct the full URL
    await jwtReqAxios.delete(fullUrl); // Make the DELETE request

    console.log("Data Before delete"); // Debugging log
    // Update local state by filtering out the deleted item
    setApiData(currentApiData => currentApiData.filter(item => item.id !== id));

    setError(null); // Reset any previous errors
    setIsLoading(false); // End loading state
  } catch (error) {
    // Error handling logic should be implemented here
    // For example, log the error and update error state
    console.error("Error deleting object:", error);
    setError(error);
    setIsLoading(false);
  }
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
