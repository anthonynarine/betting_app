import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { baseUrl } from "../../shared";

/**
 * Component to display details of a specific group.
 *
 * This component fetches data of a specific group from the backend server using the groupId
 * obtained from the URL parameters and displays the details of the group.
 */
const GroupDetailsPage = () => {
  const [groupData, setGroupData] = useState(null);
  const { groupId } = useParams();
  
  // Log the groupId to the console for testing
  console.log("Group ID:", groupId);

  useEffect(() => {
    /**
     * Function to fetch group data from the backend server.
     */
    async function getData() {
      try {
        const response = await fetch(`${baseUrl}api/groups/${groupId}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch group data");
        }

        const data = await response.json();
        setGroupData(data);
      } catch (error) {
        console.log(error);
      }
    }

    // Call the getData function to fetch group data when the component mounts or when groupId changes
    getData();
  }, [groupId]);

  return (
    <div className="App" >
      <Link to={"/"}>Back</Link>
      <h1>Group {groupId} details</h1>
      <p>{groupId}</p>
    </div>
  );
};

export default GroupDetailsPage;









//...       component setup for axios request. 

// import axios from "axios";


// //this function will fetch an individual groups data from the DB \\
// const GroupDetailsPage = () => {

//     const [groupData, setGroupData] = useState(null);
//     const {groupId} = useParams();
//     console.log(groupId);
   
//     useEffect(() => {
//       const getData = async () => {
//         try {
//           let response = await axios.get(`http://127.0.0.1:8000/api/groups/${groupId}/`);
//           // setLoading false here should popularte when data fecthing occurs
//           setGroupData(response.data);
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       getData();
//     }, [groupId]);
//     //function only triggers once



//     return(
//         <div>
//             <Link to={"/"}>Go Back</Link>
//             <h1>Group {groupId} details</h1>
//             <p>{groupId}</p>
//         </div>
//     );
// };

// export default GroupDetailsPage; 

