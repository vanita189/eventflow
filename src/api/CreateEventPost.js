
import axios from "../utils/axios";

/* Create Event */
export const createEvent = async (payload) => {
  const res = await axios.post("/event", payload);
  return res;
};

//evens list 
export const getEvents = async ({ page, limit, search, }) => {
  const res = await axios.get("/event", {
    params: {
      page: page + 1,
      limit,
      search,

    }
  })

  return {
    data: res.data,
    total: res.headers['x-total-count;']
  }
}

//id
export const getEventsById = async (id) => {
  const res = await axios.get(`/event/${id}`);
  return res.data
}

//delete event
export const deleteEvent = async (id) => {
  const res = await axios.delete(`event/${id}`);
  return res;
}

//update event
export const updateEvent = async (id, payload) => {
  const res = await axios.put(`event/${id}`,payload);
  return res;
}