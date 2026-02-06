import axiosInstance from "../utils/axios";

// Event report
export const getEventReport = async (eventId) => {
  const { data } = await axiosInstance.post("/rpc/get_event_report", {
    p_event_id: Number(eventId), // ✅ convert to integer
  });
  return data;
};

export const getMonthlyReport = async (year, month) => {
  const { data } = await axiosInstance.post("/rpc/get_monthly_report", {
    p_year: year,
    p_month: month,
  });
  return data;
};
