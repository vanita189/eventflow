import {
  Stack,
  Typography,
  Box,
  Switch,
  TextField,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/eventsslice/eventsSlice";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getEventReport, getMonthlyReport } from "../../api/ReportsPage";
import { useAuth } from "../../context/AuthContext";

function Report() {
  const [isMonthly, setIsMonthly] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (events?.length > 0 && !selectedEvent) {
      setSelectedEvent(Number(events[0].id));
    }
  }, [events]);

  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedEvent && !isMonthly) return;

      setLoading(true);

      try {
        let data = [];

        if (isMonthly) {
          data = await getMonthlyReport(
            selectedMonth.year(),
            selectedMonth.month() + 1
          );
        } else {
          data = await getEventReport(selectedEvent);
        }

        setReportData(data);
      } catch (err) {
        console.error("Error fetching report:", err);
        setReportData([]);
      }

      setLoading(false);
    };

    fetchReport();
  }, [isMonthly, selectedEvent, selectedMonth]);

  const { user } = useAuth();

  const signupDate = user?.metadata?.creationTime
    ? dayjs(user.metadata.creationTime)
    : null;

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontWeight={600} fontSize={18}>
          Reports
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontSize={13} fontWeight={500}>
              {isMonthly ? "Monthly" : "Event"}
            </Typography>

            <Switch
              checked={isMonthly}
              onChange={(e) => setIsMonthly(e.target.checked)}
              size="small"
            />
          </Stack>

          <Box width={240}>
            {!isMonthly ? (
              <TextField
                select
                fullWidth
                size="small"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(Number(e.target.value))}
              >
                {events?.map((event) => (
                  <MenuItem key={event.id} value={event.id}>
                    {event.event_name || event.eventName}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  value={selectedMonth}
                  onChange={(newValue) => setSelectedMonth(newValue)}
                  minDate={signupDate}     // ✅ disable months before signup
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          </Box>
        </Stack>
      </Stack>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : reportData.length === 0 ? (
        <Typography>No data available</Typography>
      ) : (
        <Stack spacing={2}>
          {!isMonthly && (
            <Stack spacing={2}>
              {reportData.map((item, index) => (
                <Box key={index}>
                  <Typography fontWeight={600} fontSize={15} mb={1}>
                    Event: {item.event_name}
                  </Typography>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        backgroundColor: "#fff",
                        minWidth: 220,
                      }}
                    >
                      <CardContent>
                        <Typography fontWeight={600} fontSize={14} mb={1}>
                          Tickets Sold
                        </Typography>

                        <Typography fontSize={20} fontWeight={700}>
                          {item.tickets_sold}
                        </Typography>
                      </CardContent>
                    </Card>

                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        backgroundColor: "#fff",
                        minWidth: 220,
                      }}
                    >
                      <CardContent>
                        <Typography fontWeight={600} fontSize={14} mb={1}>
                          Total Revenue
                        </Typography>

                        <Typography fontSize={20} fontWeight={700}>
                          ₹{item.total_revenue}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}

          {isMonthly && reportData.length > 0 && (
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  backgroundColor: "#fff",
                  minWidth: 220,
                }}
              >
                <CardContent>
                  <Typography fontWeight={600} fontSize={14} mb={1}>
                    Total Tickets
                  </Typography>

                  <Typography fontSize={20} fontWeight={700}>
                    {reportData[0].total_tickets}
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  backgroundColor: "#fff",
                  minWidth: 220,
                }}
              >
                <CardContent>
                  <Typography fontWeight={600} fontSize={14} mb={1}>
                    Total Revenue
                  </Typography>

                  <Typography fontSize={20} fontWeight={700}>
                    ₹{reportData[0].total_revenue}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
}

export default Report;
