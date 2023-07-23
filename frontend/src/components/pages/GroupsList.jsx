//  FIRST COMPONENT CREATED 
//  THIS COMPONENT WILL GRAB DATA FROM THE DB LOOP THROUGHT AND RENDER
// WITH LINK TAGS. 

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function GroupsList() {
  //1. whenever i load the app i want to fetch the data from the api

  //data grabbed from useEffect hook function to be used here\\
  const [groupsData, setGroupsData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        let response = await axios.get("http://127.0.0.1:8000/api/groups/");
        // setLoading false here should popularte when data fecthing occurs
        setGroupsData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  //function only triggers once

  return (
    <div className="App">
      <header className="App-header">
        {/* this syntax evaluates as check the 1st one then goes to next - if 1st fail 2nd will not be triggered */}
        {/* so here we are checking if we have "groupData" if we do map out something. don't move on to map */}
        {groupsData &&
          groupsData.map((group) => {
            return (
              <Link to={`/details/${group.id}`} key={group.id} >
                <p>
                  {group.name}: {group.location}
                </p>
              </Link>
            );
          })}
      </header>
    </div>
  );
}

export default GroupsList;

                // Notes \\
// key need to be placed in highest level element 

// <Link key={group.id} to={`/details/${group.id}`} >  this code 
// is dynamically grabbing the group id from the loop so on this example 
// clicling on the first one the id will be on 1 on the second id will be 2
// and so on 


