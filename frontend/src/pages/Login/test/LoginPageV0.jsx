import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useAuthServices } from "../../../Auth/AuthServices";


function LoginTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { obtainTokens, getUserIdFromToken, getUserDetails  } = useAuthServices();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tokens = await obtainTokens(email, password);
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);
      localStorage.setItem("userId", getUserIdFromToken(tokens.access))

      await getUserDetails();

      //TESTS
      console.log("Access Token being stored:", tokens.access);
      console.log("Refresh Token being stored:", tokens.refresh);
      console.log("getUserIdFromToken:", getUserIdFromToken(tokens.access));


      // navigate("/testlogin/")
    } catch (error) {
      console.error(error);
    }

    // Handle the form submission logic here
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginTest;
