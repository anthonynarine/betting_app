import React, { useState } from "react";

import Home from "./pages/pages/Home";
import Groups from "./pages/structure/Main/Groups/Groups";

import { Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import ToggleColorModeProvider from "./color/ToggleColorMode";


function App() {

  return (
    <ToggleColorModeProvider >
      <CssBaseline />
      <Routes>
        <Route path="/" element={< Home />} />
        <Route path="/groups/:groupId" element={<Groups />} />

      </Routes>
    </ToggleColorModeProvider>
  );
}

export default App;
