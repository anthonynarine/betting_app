import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../shared";
import { Typography } from "@mui/material";

/**
 * Functional component to display a list of groups fetched from an API.
 */
function GroupsList() {
  // State variable to hold the data fetched from the API
  const [groups, setGroups] = useState(null);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        console.log("Fetching groups data...");
        const response = await fetch(`${baseUrl}api/groups/`);
        if (!response.ok) {
          throw new Error("Failed to fetch groups data");
        }
        const data = await response.json();
        console.log("Fetched DATA:", data);
        // Set the groupsData state with the fetched data
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* Conditional rendering of groupsData */}
        {groups ? (
          // If groupsData exists, map the groups
          groups.map((group) => (
            // Link to the details page for each group
            <div >
              <Link to={`/details/${group.id}`} key={group.id}>
                <Typography variant="h6" >
                  {group.name}: {group.location}
                </Typography>
              </Link>
            </div>
          ))
        ) : (
          // If groupsData is null (still loading), display a loading message
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default GroupsList;

// ... component setup using axiox

//       //  import axios from "axios";
// /**
//  * Functional component to display a list of groups fetched from an API.
//  */
// function GroupsList() {
//   // State variable to hold the data fetched from the API
//   const [groupsData, setGroupsData] = useState(null);

//   // Fetch data from the API when the component mounts
//   useEffect(() => {
//     // Function to fetch data from the API
//     async function getData() {
//       try {
//         console.log("Fetching groups data...");
//         const response = await axios.get("http://127.0.0.1:8000/api/groups/");
//         console.log("Data fetched successfully:", response.data);
//         // Set the groupsData state with the fetched data
//         setGroupsData(response.data);
//       } catch (error) {
//         console.error("Error fetching groups data:", error);
//       }
//     }
//     getData();
//   }, []);

//   return (
//     <div className="App">
//       <header className="App-header">
//         {/* Conditional rendering of groupsData */}
//         {groupsData ? (
//           // If groupsData exists, map the groups
//           groupsData.map((group) => (
//             // Link to the details page for each group
//             <Link to={`/details/${group.id}`} key={group.id}>
//               <p>
//                 {group.name}: {group.location}
//               </p>
//             </Link>
//           ))
//         ) : (
//           // If groupsData is null (still loading), display a loading message
//           <p>Loading...</p>
//         )}
//       </header>
//     </div>
//   );
// }

// export default GroupsList;
