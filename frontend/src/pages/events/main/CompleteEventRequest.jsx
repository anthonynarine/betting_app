import { useEffect } from "react";
import useCrud from "../../../services/useCrud";
import { useParams } from "react-router-dom";
import { useBetData } from "../../../context/bet/BetDataProvider";

/**
 * The CompleteEventRequest component is responsible for handling the API request to complete an event.
 * It is designed to be used within a parent component that manages the state of an event, such as an event form
 *  this component is rendered in CompleteEventReqeust.jsx.
 *
 * Params:
 * - `winner`: The selected winner's identifier for the event. This is typically received from the state of the parent component.
 * - `onSuccess`: A callback function to be executed upon successful completion of the event. This allows the parent component to react accordingly, such as updating the UI or displaying a success message.
 * - `onError`: A callback function to be executed in case of an error during the event completion process. This allows the parent component to handle errors, such as displaying error messages.
 * - `loadingMessage`: A message displayed while the event completion process is ongoing. This is for user feedback and is typically displayed in the UI of the parent component.
 * - `successMessage`: A default success message to be used if the API does not provide a specific success message.
 * - `errorMessage`: A default error message to be used if the API call fails without a specific error message.
 *
 * The component uses `useParams` from `react-router-dom` to access the `eventId`, which is assumed to be a URL parameter in the parent component's route. This means that the component is meant to be used in a route where `eventId` is part of the URL path.
 *
 * The `useCrud` custom hook is used to abstract the API request logic. It is expected to provide a `createObject` function that handles API POST requests.
 */
const CompleteEventRequest = ({
  winner,
  onSuccess,
  onError,
  loadingMessage,
  successMessage,
  errorMessage,
}) => {
  const { createObject } = useCrud();
  const { eventId } = useParams();
  const { updateIndividualBet, individualBet } = useBetData();

  useEffect(() => {
    /**
     * Asynchronously sends a request to complete an event by marking a winner.
     * This function is executed when the component mounts or when its dependencies change.
     */
    const completeEvent = async () => {
      if (winner) {
        // Display the loading message in the console (or potentially in the UI)
        console.log(loadingMessage);
    
        // Prepare the data to be sent in the request
        const eventData = { winning_team: winner };
    
        try {
          const response = await createObject(`/events/${eventId}/mark-as-complete/`, eventData);
          console.log(response);
          // Extract specific messages from the response or use the provided default success message
          const detailMessage = response?.data?.details || successMessage;
          console.log(detailMessage);
          onSuccess(response, detailMessage);

          // // Once the event is completed, if you have betting ID, update individual bet 
          // if (individualBet && individualBet.id){
          //    await updateIndividualBet(individualBet.id) // Updates EventDetailCard UI   
          // };
        } catch (error) {
          console.error("Error completing event:", error);
          
          // Extract error message from the error object or use the provided default error message
          const errorDetail = error.response?.data?.detail || errorMessage;
          console.error(errorDetail);
          onError(errorDetail);
        }
      }
    };

    completeEvent();
  }, [winner]);
};


export default CompleteEventRequest;
