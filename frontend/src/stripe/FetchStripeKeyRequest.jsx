import { useEffect, useState } from "react";
import useAxiosWithInterceptorJwt from "../services/jwtinterceptor-jwtReq";

const useFetchStripeKey = () => {
  const [stripePublicKey, setStripePublicKey] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const jwtReqAxios = useAxiosWithInterceptorJwt();

  useEffect(() => {
    console.log("useFetchStripeKey hook called");
    const fetchStripeKey = async () => {
      setIsloading(true);
      setError(null);
      try {
        console.log("Attempting to fetch Stripe key");
        const response = await jwtReqAxios.get("/stripe/config/");
        console.log("Response received:", response);
        const  stripePublicKey  = response.data.publicKey;
        console.log("Key received:", stripePublicKey);
        localStorage.setItem("stripeKey", stripePublicKey);
        setStripePublicKey(stripePublicKey);
      } catch (err) {
        console.error("Error fetching Stripe key:", err);
        setError(err);
      } finally {
        setIsloading(false);
      }
    };
    fetchStripeKey();
  }, []);

  return { isLoading, error, stripePublicKey };
};

export default useFetchStripeKey;
