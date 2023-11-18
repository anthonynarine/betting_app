import { useState } from "react";
import useAxiosWithInterceptor from "./jwtinterceptor";

const useCrud = ([], apiURL) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const jwtAxios = useAxiosWithInterceptor();
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (accessToken) => {
    setIsLoading(true);
    try {
      if (!BASE_URL) {
        throw new Error("BASE_URL is not defined");
      }
      // Set the authorization header only if an access token is provided
      if (accessToken) {
        jwtAxios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await jwtAxios.get(`${BASE_URL}${apiURL}`);
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
  };

  return { apiData, error, isLoading, fetchData };
};

export default useCrud;
