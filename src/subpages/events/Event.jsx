import Typography from "@mui/material/Typography";
import EventIcon from "@mui/icons-material/Event";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import CreateIcon from "@mui/icons-material/Create";
import DataTable from "../../components/DataTable";
import { useEffect } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/eventsslice/eventsSlice";
import InfoIcon from '@mui/icons-material/Info';

const columns = [
    { id: "slNo", label: "Sl No" },
    { id: "eventName", label: "Event Name" },
    { id: "eventStartDate", label: "Start Date" },
    { id: "eventEndDate", label: "End Date" },
    { id: "ticketWindow", label: "Ticket Window" },
    { id: "eventCapacity", label: "Event Capacity" },
    { id: "actions", label: "Action" },
];

function Event() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { events, loading } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    // ✅ MAP API DATA → TABLE ROWS (CORRECT PLACE)
    const rows = events.map((event, index) => ({
        slNo: index + 1,
        eventName: event.eventName,
        eventStartDate: new Date(event.eventStartDate).toLocaleDateString(),
        eventEndDate: new Date(event.eventEndDate).toLocaleDateString(),
        ticketWindow: `${new Date(
            event.ticketStartDate
        ).toLocaleDateString()} - ${new Date(
            event.ticketEndDate
        ).toLocaleDateString()}`,
        eventCapacity: event.eventCapacity,
        actions: <InfoIcon />,
    }));

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={1}>
                <EventIcon />
                <Typography variant="h6">Events</Typography>
            </Box>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
            >
                <Autocomplete
                    freeSolo
                    sx={{ flex: 1, maxWidth: 250 }} // ✅ make it expand
                    options={[]}
                    popupIcon={null}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search events"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />

                <PrimaryButton
                    startIcon={<CreateIcon />}
                    onClick={() => navigate("/dashboardlayout/events/create")}
                >
                    Create Event
                </PrimaryButton>
            </Box>

            <Box mt={5}>
                {loading ? (
                    <Typography>Loading events...</Typography>
                ) : (
                    <DataTable columns={columns} rows={rows} />
                )}
            </Box>
        </Box>
    );
}

export default Event;
