import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Card,
  CardMedia,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/event/${id}`);
      setEvent(addLifecycleStatus(res.data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addLifecycleStatus = (event) => {
    const now = new Date();
    const start = new Date(event.eventStartDate);
    const end = new Date(event.eventEndDate);
    let lifecycleStatus = "";

    if (now < start) lifecycleStatus = "upcoming";
    else if (now >= start && now <= end) lifecycleStatus = "live";
    else lifecycleStatus = "completed";

    return { ...event, lifecycleStatus };
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/event/${id}`);
      navigate("/dashboardlayout/events");
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "success";
      case "upcoming":
        return "info";
      case "completed":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) return <Typography>Loading event details...</Typography>;
  if (!event) return <Typography>No event found</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 1100, mx: "auto" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 300, md: 450 },
          borderRadius: 3,
          overflow: "hidden",
          mb: 4,
        }}
      >
        <CardMedia
          component="img"
          src={event.eventImage || "https://placehold.co/1200x450?text=No+Image"}
          alt={event.eventName}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            left: 24,
            color: "#fff",
          }}
        >
          <Typography variant="h3" fontWeight={700}>
            {event.eventName}
          </Typography>
          <Chip
            label={event.lifecycleStatus.toUpperCase()}
            color={getStatusColor(event.lifecycleStatus)}
            sx={{ mt: 1, fontWeight: 600 }}
          />
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ position: "absolute", top: 24, right: 24 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/dashboardlayout/events/edit/${id}`)}
          >
            Edit
          </Button>
         
        </Stack>
      </Box>

      {/* Event Details + Packages */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
        {/* Event Info */}
        <Paper sx={{ flex: 1, p: 3, borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
          <Stack spacing={2}>
            {event.eventLocation && (
              <Box display="flex" alignItems="center" gap={1}>
                <MapIcon color="primary" />
                <Typography fontWeight={500}>{event.eventLocation}</Typography>
              </Box>
            )}
            <Divider />
            <Typography>
              <strong>Start:</strong> {new Date(event.eventStartDate).toLocaleString()}
            </Typography>
            <Typography>
              <strong>End:</strong> {new Date(event.eventEndDate).toLocaleString()}
            </Typography>
            <Typography>
              <strong>Ticket Window:</strong>{" "}
              {`${new Date(event.ticketStartDate).toLocaleDateString()} - ${new Date(
                event.ticketEndDate
              ).toLocaleDateString()}`}
            </Typography>
            <Typography>
              <strong>Capacity:</strong> {event.eventCapacity}
            </Typography>
            <Typography>
              <strong>Tags:</strong> {event.eventTags}
            </Typography>
            <Typography>
              <strong>Description:</strong> {event.eventDescription}
            </Typography>
          </Stack>
        </Paper>

        {/* Packages */}
        <Paper sx={{ flex: 1, p: 3, borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
          <Typography variant="h6" mb={2} fontWeight={600}>
            Packages
          </Typography>
          <Stack spacing={2}>
            {event.packages.list.map((pkg, idx) => (
              <Paper
                key={idx}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(0,0,0,0.12)" },
                }}
              >
                <Typography fontWeight={500}>{pkg.packageName}</Typography>
                <Typography>
                  {pkg.price === 0 ? "Free" : `₹${pkg.price}`} | Allowed: {pkg.allowedPersons} | Qty: {pkg.quantity}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Event?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventDetails;
