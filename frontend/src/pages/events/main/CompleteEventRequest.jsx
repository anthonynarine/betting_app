
// THIS COMPONENT IS NO LONGER IN USE THIS  REQUEST WAS MODIFIED AND ADDED TO THE FORM THE
// THE useEffect WAS CAUSING MULTIPE REQUEST TO REFUND ESENTIALLY GIVING USER 2X THEIR INITIAN
// BETS AMOUNT ON SENARIOS WHERE ONLY 1 PERSON ENTERED A BET FOR THE EVENT. 


// import { useEffect } from "react";
// import useCrud from "../../../services/useCrud";
// import { useParams } from "react-router-dom";
// import { useBetData } from "../../../context/bet/BetDataProvider";

// /**
//  * Function to handle the API request to complete an event.
//  * 
//  * Params:
//  * - `winner`: The selected winner's identifier for the event.
//  * - `onSuccess`: Callback function for successful completion.
//  * - `onError`: Callback function for handling errors.
//  * - `loadingMessage`: Message to display while processing.
//  * - `successMessage`: Default success message.
//  * - `errorMessage`: Default error message.
//  */
// const completeEvent = async ({ winner, onSuccess, onError, loadingMessage, successMessage, errorMessage }) => {
//   // Using the useCrud hook to perform CRUD operations
//   const { createObject } = useCrud();

//   // Accessing the event ID from the URL parameters
//   const { eventId } = useParams();

//   // Display the loading message (can be used for UI feedback)
//   console.log(loadingMessage);

//   // Prepare the data for the API request
//   const eventData = { winning_team: winner };

//   try {
//       // Making the API call to complete the event
//       const response = await createObject(`/events/${eventId}/mark-as-complete/`, eventData);
      
//       // Log the response for debugging
//       console.log(response);

//       // Extract the detail message from the response or use the default success message
//       const detailMessage = response?.data?.details || successMessage;

//       // Execute the onSuccess callback function with the response and message
//       onSuccess(response, detailMessage);
//   } catch (error) {
//       // Log the error for debugging
//       console.error("Error completing event:", error);

//       // Extract the detail message from the error or use the default error message
//       const errorDetail = error.response?.data?.detail || errorMessage;

//       // Execute the onError callback function with the error detail
//       onError(errorDetail);
//   }
// };

// export default completeEvent;