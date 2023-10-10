import axios from "axios";
import { BASE_URL } from "../config";
import { useState } from "react";
import useAxiosWithInterceptor from "./jwtinterceptor";

const useCrud = ([], apiURL) => {
  const jwtAxios = useAxiosWithInterceptor();
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await jwtAxios.get(`${BASE_URL}${apiURL}`);
      const data = response.data;
      console.log("API Data:", data);
      setApiData(data);
      setError(null);
      setIsLoading(false);
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(new Error("400"));
        console.error(error)
      }
      console.error("Error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  return { apiData, error, isLoading, fetchData };
};

export default useCrud;
