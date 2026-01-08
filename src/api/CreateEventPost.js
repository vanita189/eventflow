// // src/api/events.api.js
// import axios from "../utils/axios";

// /* 1️⃣ Create Event */
// export const createEvent = async (payload) => {
//   const res = await axios.post("/events", payload);
//   return res.data;
// };

// /* 2️⃣ Get Event List (pagination) */
// export const getEvents = async ({ page = 1, limit = 10 }) => {
//   const res = await axios.get("/events", {
//     params: { page, limit },
//   });
//   return res.data;
// };

// /* 3️⃣ Get Single Event (for edit/view) */
// export const getEventById = async (eventId) => {
//   const res = await axios.get(`/events/${eventId}`);
//   return res.data;
// };

// /* 4️⃣ Update Event */
// export const updateEvent = async (eventId, payload) => {
//   const res = await axios.put(`/events/${eventId}`, payload);
//   return res.data;
// };

// /* 5️⃣ Delete / Disable Event */
// export const deleteEvent = async (eventId) => {
//   const res = await axios.delete(`/events/${eventId}`);
//   return res.data;
// };

// /* 6️⃣ Filter Events */
// export const filterEvents = async (filters) => {
//   const res = await axios.get("/events/filter", {
//     params: filters,
//   });
//   return res.data;
// };

// /* 7️⃣ Change Event Status */
// export const updateEventStatus = async (eventId, status) => {
//   const res = await axios.patch(`/events/${eventId}/status`, { status });
//   return res.data;
// };
import axios from "../utils/axios";

/* Create Event */
export const createEvent = async (payload) => {
  const res = await axios.post("/event", payload);
  return res.data;
};

/* Get Events */
export const getEvents = async ({ page = 1, limit = 10 }) => {
  const res = await axios.get("/events", {
    params: { page, limit },
  });
  return res.data;
};

/* Get Single Event */
export const getEventById = async (eventId) => {
  const res = await axios.get(`/events/${eventId}`);
  return res.data;
};

/* Update Event */
export const updateEvent = async (eventId, payload) => {
  const res = await axios.put(`/events/${eventId}`, payload);
  return res.data;
};

/* Delete Event */
export const deleteEvent = async (eventId) => {
  const res = await axios.delete(`/events/${eventId}`);
  return res.data;
};

/* Filter Events */
export const filterEvents = async (filters) => {
  const res = await axios.get("/events/filter", {
    params: filters,
  });
  return res.data;
};

/* Update Event Status */
export const updateEventStatus = async (eventId, status) => {
  const res = await axios.patch(`/events/${eventId}/status`, { status });
  return res.data;
};
