import { useState } from "react";
import useAxiosWithInterceptor from "./jwtinterceptor-jwtNotReq";

const useBetCrud = (apiURL) => {
  const jwtAxios = useAxiosWithInterceptor();
  const [betData, setBetData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBetData = async () => {
    setIsLoading(true);
    try {
      const response = await jwtAxios.get("/bet/");
      setBetData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching bet data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createBet = async (betDetails, onSuccess, onError) => {
    setIsLoading(true);
    console.log("Bet details before sending:", betDetails); // bet details prior to request
    try {
      const response = await jwtAxios.post("/bet/", betDetails);
      setBetData([...betData, response.data]);
      setError(null);
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      setError(error);
      console.error("Error creating bet:", error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };



  return {betData, error, isLoading, createBet}
};
