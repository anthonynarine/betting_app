import { useState } from "react";
import useAxiosWithInterceptor from "../../../services/jwtinterceptor";
import { useAuthServices } from "../../../context/Auth/AuthServices";

const TestLogin = () => {
  const jwtAxios = useAxiosWithInterceptor();
  
  const { isLoggedIn, logout } = useAuthServices();
  console.log("LOGIN STATUS", isLoggedIn);

  const [userEmail, setUserEmail] = useState();

  const getUserDetails = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");
      const response = await jwtAxios.get(`http://127.0.0.1:8000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userDetails = response.data;
      console.log(response)
      setUserEmail(userDetails.email);
      console.log(userDetails.email)
    } catch (error) {
      console.log("Error obtaining user details:", error.message);
      return error;
    }
  };

  return (
    <>
      <div>{isLoggedIn.toString()}</div>
      <div>
        <button onClick={logout}>Logout</button>
        <button onClick={getUserDetails}>GetUserDetails</button>
      </div>
      <div>UserEmail: {userEmail}</div>
    </>
  );
};
export default TestLogin;
