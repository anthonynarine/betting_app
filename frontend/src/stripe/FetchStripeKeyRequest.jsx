
import { useEffect, useState } from "react";
import useAxiosWithInterceptorJwt from "../services/jwtinterceptor-jwtReq";


const useFetchStripeKey = () => {
    const [stripePublicKey, setStripePublicKey] = useState(null);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState(null);
    const jwtReqAxios = useAxiosWithInterceptorJwt();

    useEffect(()=>{
        const fetStripeKey = async () => {
            setIsloading(true);
            setError(null);

            try {
                const response = await jwtReqAxios.get("/stripe/config/")
                const { stripePublicKey } = response.data;
                localStorage.setItem("stripeKey", stripePublicKey);  
                setStripePublicKey(stripePublicKey)
            } catch (error) {
                setError(error)
                console.error("Error fetching Stripe key:", error);
            } finally {
                setIsloading(false);
            }
        };
        fetStripeKey();

        return { isLoading, error, stripePublicKey }
    },[jwtReqAxios])
}

export default useFetchStripeKey;