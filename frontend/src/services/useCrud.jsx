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
    // createData(groupData, '/groups/)
    // createData(eventData, '/events/)
  };

  const updateObject = async (url, id, data) => {
    setIsLoading(true);
    try {
      const response = await jwtReqAxios.put(`${url}/${id}/`, data);
      const updatedData = response.data;
      setApiData(apiData.map(item => item.id === id ? updatedData : item));
      setError(null);
      setIsLoading(false);
      return updatedData;
    } catch (error) {
      console.error("Error updating object", error);
      setError(error);
      setIsLoading(false);
      throw error;
    }
  };

  const deleteObject = async (url, id) => {
    setIsLoading(true);
    try {
      await jwtReqAxios.delete(url)
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
