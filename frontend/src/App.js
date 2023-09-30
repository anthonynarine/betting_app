import React from "react";
import Home from "./pages/pages/Home";

import { Route, Routes } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={< Home />} />
        {/* <Route path="/details/:groupId" element={<GroupDetailsPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
