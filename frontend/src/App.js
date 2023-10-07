import React, { useState } from "react";

import Home from "./pages/pages/Home";
import DetailPage from "./pages/pages/DetailsPage";
import LoginPage from "./pages/pages/Login/LoginPage";
import LoginPageV0 from "./pages/pages/Login/test/LoginPageV0";

import { Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import ToggleColorModeProvider from "./color/ToggleColorMode";

import AuthProvider from "./context/AuthContext";

function App() {


  
  return (
    <AuthProvider>
      <ToggleColorModeProvider>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/group/:groupId" element={<DetailPage />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="/login" element={<LoginPageV0 />} />
        </Routes>
      </ToggleColorModeProvider>
    </AuthProvider>
  );
}

export default App;
