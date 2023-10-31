import Home from "./pages/home/Home";
// import DetailPage from "./pages/detailsPage/DetailsPage";

import DetailPage from "./pages/details/DetailsPage";
import { Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import ToggleColorModeProvider from "./color/ToggleColorMode";

import AuthProvider from "./context/AuthContext";
import LoginPageV0 from "./pages/Login/test/LoginPageV0";
import TestLogin from "./pages/Login/test/TestLogin";
import LoginPage from "./pages/Login/LoginPage";
import Signup from "./pages/signup/SignupPage";
import ProtectedRoute from "./Auth/ProtectedRoute";
// import { LoginProvider } from "./context/login/LoginProvider";  //NO LONGER IN USE
import EventPage from "./pages/events/EventPage";
import { ApiDataProvider } from "./context/apiDataProvider/ApiDataProvider";

function App() {
  return (
    <AuthProvider>
      {/* <LoginProvider> */}
      <ToggleColorModeProvider>
        <ApiDataProvider>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/group/:groupId" element={<DetailPage />} />
            <Route path="/event/:eventId" element={<EventPage />} />
            {/* <Route path="/login" element={<LoginPageV0 />} /> */}
            <Route
              path="/testlogin"
              element={
                <ProtectedRoute>
                  <TestLogin />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </ApiDataProvider>
      </ToggleColorModeProvider>
      {/* </LoginProvider> */}
    </AuthProvider>
  );
}

export default App;
