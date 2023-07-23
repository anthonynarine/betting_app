import React from "react";
// import { BrowserRouter as } from 'react-router-dom';
// import C1GroupList from "./components/C1GroupList";
import Header from "./components/Header";
import Sidebarr from "./components/SideBar";
import GroupsList from "./components/pages/GroupsList";
import GroupDetailsPage from "./components/pages/GroupDetails";

import "./App.css";
import "./index.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header />
        <div className="general-content">
          <Sidebarr />
          <Routes>
            <Route path="/" element={<GroupsList />} />
            <Route path="/details/:groupId" element={<GroupDetailsPage />} /> 
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

// my domain.com/welcome => GroupsList + Header + Sidebarr
// my domain.com/groups => GroupList component
// my domain.com/group-detail:<any value> (groupId used above) (dynamic routing)

//  NOTE <Route path="/*" exact element={<C3Main />}/>
//  when rendering a route that will render more routes
// as in this case the path must contain /* this allows the brower
// to match anything that comes after

// https://www.youtube.com/watch?v=Ul3y1LXxzdU 26: EXPLAINS
// THE USE CASE FOR *
