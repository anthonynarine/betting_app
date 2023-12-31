import Home from "./pages/home/Home";
// import DetailPage from "./pages/detailsPage/DetailsPage";

import DetailPage from "./pages/details/DetailsPage";
import { Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import ToggleColorModeProvider from "./color/ToggleColorMode";

import AuthProvider from "./context/Auth/AuthContext";
import UserServiceProvider from "./context/user/UserContext";
import LoginPageV0 from "./pages/login/test/LoginPageV0";
// import TestLogin from "./pages/login/test/TestLogin"

import TestLogin from "./pages/login/test/testLogin";
import LoginPage from "./pages/login/LoginPage";
import Signup from "./pages/signup/SignupPage";
import ProtectedRoute from "./context/Auth/ProtectedRoute";
// import { LoginProvider } from "./context/login/LoginProvider";  //NO LONGER IN USE
import EventPage from "./pages/events/EventPage";

//Stripe
import StripeChargeComponent from "./stripe/StripeChargeRequest";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useFetchStripeKey from "./stripe/FetchStripeKeyRequest";

function App() {

  const { stripePublicKey } = useFetchStripeKey();
  const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;
  console.log(stripePromise)

  return (
    <AuthProvider>
      <UserServiceProvider>
        <ToggleColorModeProvider>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/group/:groupId" element={<DetailPage />} />
            <Route path="/event/:eventId" element={<EventPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/login" element={<LoginPageV0 />} /> */}
            <Route
              path="/testlogin"
              element={
                <ProtectedRoute>
                  <TestLogin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addfunds"
              element={
                <Elements stripe={stripePromise} >
                  <StripeChargeComponent />
                </Elements>
              }
            />
          </Routes>
        </ToggleColorModeProvider>
      </UserServiceProvider>
    </AuthProvider>
  );
}

export default App;
