
export const handleDeleteObject = async (deleteObject, eventId, navigate) => {
   try {
    await deleteObject(`/events/${eventId}`, eventId)
    console.log("Event deleted successfully");
    navigate("/")
   } catch (error) {
    console.error("Error deleteing event:", error); 
   }

};