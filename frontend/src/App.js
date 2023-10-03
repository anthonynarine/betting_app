import React, { useState } from "react";

import Home from "./pages/pages/Home";
import DetailPage from "./pages/pages/DetailsPage";
import LoginPage from "./pages/pages/Login/LoginPage";

import { Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import ToggleColorModeProvider from "./color/ToggleColorMode";


function App() {

  return (
    <ToggleColorModeProvider >
      <CssBaseline />
      <Routes>
        <Route path="/" element={< Home />} />
        <Route path="/group/:groupId" element={<DetailPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </ToggleColorModeProvider>
  );
}

export default App;
