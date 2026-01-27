
// import axios from "../utils/axios";

// /* Create Event */
// export const createEvent = async (payload) => {
//   const res = await axios.post("/event", payload);
//   return res;
// };

// //evens list 
// export const getEvents = async ({ page, limit, search, }) => {
//   const res = await axios.get("/event", {
//     params: {
//       page: page + 1,
//       limit,
//       search,

//     }
//   })

//   return {
//     data: res.data,
//     total: res.headers['x-total-count;']
//   }
// }

// //id
// export const getEventsById = async (id) => {
//   const res = await axios.get(`/event/${id}`);
//   return res.data
// }

// //delete event
// export const deleteEvent = async (id) => {
//   const res = await axios.delete(`event/${id}`);
//   return res;
// }

// //update event
// export const updateEvent = async (id, payload) => {
//   const res = await axios.put(`event/${id}`,payload);
//   return res;
// }
import axiosInstance from "../utils/axios"


// Create event
export const createEvent = async (payload) => {
  const res = await axiosInstance.post("/events", payload);
  return res.data;
};

// Fetch all events
export const getEvents = async () => {
  const res = await axiosInstance.get(
    "/events?select=*&order=created_at.desc"
  );

  return {
    data: res.data,       // 👈 what Redux uses
    total: res.data.length // 👈 for pagination
  };
};


// Get event by ID
export const getEventsById = async (id) => {
  const res = await axiosInstance.get(`/events?select=*&id=eq.${id}`);
  return res.data[0];
};

// Update event
export const updateEvent = async (id, payload) => {
  const res = await axiosInstance.patch(`/events?id=eq.${id}`, payload);
  return res.data;
};

// Delete event
export const deleteEvent = async (id) => {
  const res = await axiosInstance.delete(`/events?id=eq.${id}`);
  return res.data;
};
