import axios from "../utils/axios";

//createEvent
export const createEvent = async(payload) =>{
    const response = await axios.post("/event",payload)
    return response.data;
}