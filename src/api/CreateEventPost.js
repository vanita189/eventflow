
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

import axios from "../utils/axios";

/* Create Event */
export const createEvent = async (payload) => {
  return axios.post("/events", payload);
};

/* Events list */
export const getEvents = async () => {
  const res = await axios.get("/events", {
    params: {
      select: "*",
      order: "created_at.desc",
    },
  });
  return res.data;
};

/* Event by ID */
export const getEventsById = async (id) => {
  const res = await axios.get("/events", {
    params: {
      id: `eq.${id}`,
      select: "*",
    },
  });
  return res.data[0];
};

/* Update event */
export const updateEvent = async (id, payload) => {
  return axios.patch(`/events?id=eq.${id}`, payload);
};

/* Delete event */
export const deleteEvent = async (id) => {
  return axios.delete(`/events?id=eq.${id}`);
};
