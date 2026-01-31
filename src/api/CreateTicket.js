import axios from "axios";
import axiosInstance from "../utils/axios";

//createticket
export const createTicket = async (payload) => {
    const res= await axiosInstance.post("/tickets", payload);
    return res.data;
}

//get all tickets 
export const getTickets = async()=>{
    const res = await axiosInstance.get("/tickets?select=*&order=created_at.desc");
    return{
        data:res.data,
        total:res.data.length,

    }
}

//get tickets by events id
export const getTicketByEvent = async(eventId)=>{
    const res = await axiosInstance.get(`/tickets?event_id=eq.${eventId}`)
    return res.data
}

//get ticket by ticket id
export const getTicketById = async(id)=>{
    const res = await axiosInstance.get(`/tickets?id=eq.${id}`)
    return res.data[0]
}