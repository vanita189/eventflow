import {
  Box,
  Card,
  Typography,
  Stack,
  Switch,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";

function ReportsPage({ events = [] }) {
  const [isMonthly, setIsMonthly] = useState(false); // false = Event wise
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  return (
    <Box p={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={700}>
          📊 Reports
        </Typography>

        {/* Switch */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography color={!isMonthly ? "primary" : "text.secondary"}>
            Event Wise
          </Typography>

          <Switch
            checked={isMonthly}
            onChange={(e) => setIsMonthly(e.target.checked)}
            color="primary"
          />

          <Typography color={isMonthly ? "primary" : "text.secondary"}>
            Monthly
          </Typography>
        </Stack>
      </Stack>

      {/* Filter Section */}
      <Card sx={{ mt: 2, p: 2, borderRadius: 2 }}>
        {!isMonthly ? (
          // ✅ Event-wise dropdown
          <TextField
            select
            fullWidth
            size="small"
            label="Select Event"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <MenuItem value="">All Events</MenuItem>
            {events.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.eventName}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          // ✅ Monthly picker
          <TextField
            type="month"
            fullWidth
            size="small"
            label="Select Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        )}
      </Card>

      {/* Report Result */}
      <Card sx={{ mt: 2, p: 2, borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {isMonthly
            ? `Showing Monthly Report for ${selectedMonth}`
            : `Showing Event Report for ${
                selectedEvent || "All Events"
              }`}
        </Typography>

        <Typography variant="h6" fontWeight={700} mt={1}>
          ₹ 0 {/* later backend data */}
        </Typography>
      </Card>
    </Box>
  );
}

export default ReportsPage;
