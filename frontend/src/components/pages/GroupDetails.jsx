
import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { baseUrl } from "../../shared";

// const GroupDetailsPage = () => {
//   const [groupData, setGroupData] = useState(null);
//   const { groupId } = useParams();
//   console.log(groupId);

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const response = await fetch(`${baseUrl}api/groups/${groupId}/`);
//         if (!response.ok) {
//           // Handle non-successful response (e.g., 404, 500)
//           throw new Error("Failed to fetch group data");
//         }

//         const data = await response.json();
//         setGroupData(data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getData();
//   }, [groupId]);

//   return (
//     <div>
//       <Link to={"/"}>Back</Link>
//       <h1>Group {groupId} details</h1>
//       <p>{groupId}</p>
//     </div>
//   );
// };

// export default GroupDetailsPage;











import axios from "axios";


//this function will fetch an individual groups data from the DB \\
const GroupDetailsPage = () => {

    const [groupData, setGroupData] = useState(null);
    const {groupId} = useParams();
    console.log(groupId);
   
    useEffect(() => {
      const getData = async () => {
        try {
          let response = await axios.get(`http://127.0.0.1:8000/api/groups/${groupId}/`);
          // setLoading false here should popularte when data fecthing occurs
          setGroupData(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    }, [groupId]);
    //function only triggers once



    return(
        <div>
            <Link to={"/"}>Back</Link>
            <h1>Group {groupId} details</h1>
            <p>{groupId}</p>
        </div>
    );
};

export default GroupDetailsPage; 

