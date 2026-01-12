
import axios from "../utils/axios";

/* Create Event */
export const createEvent = async (payload) => {
  const res = await axios.post("/event", payload);
  return res;
};

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



