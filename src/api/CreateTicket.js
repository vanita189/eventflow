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


// Get ticket by code (safe & robust)
export const getTicketByCode = async (code) => {
  const cleanCode = code.trim().toUpperCase(); // important fix

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("ticket_code", cleanCode)
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error("Ticket not found");
  }

  return data[0];
};

//  Redeem ticket
export const redeemTicket = async (id) => {
  const { data, error } = await supabase
    .from("tickets")
    .update({
      is_redeemed: true,
      redeemed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

