import GroupsList from "./pages/GroupsList";
import GroupDetailsPage from "./pages/GroupDetails";
import { Routes, Route } from "react-router-dom";

import React from "react";

export default function Main() {
  return (
    <div className="main">
      <Routes>
        <Route exact path="/" element={<GroupsList />} />
        <Route path="/details/:groupId" element={<GroupDetailsPage />} />
      </Routes>
    </div>
  );
}
