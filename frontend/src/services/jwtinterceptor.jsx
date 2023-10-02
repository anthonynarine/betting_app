import axios from "axios"
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config"



const useAxiosWithInterceptor = () => {
  const API_BASE_URL = BASE_URL;
  const jwtAxios = axios.create({ baseURL: API_BASE_URL });

  // Remove the 401 handling code from the interceptor
  jwtAxios.interceptors.response.use((response) => {
    return response;
  });

  return jwtAxios;
};

export default useAxiosWithInterceptor;
