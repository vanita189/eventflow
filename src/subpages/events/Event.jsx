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
import { fetchEvents, setSearch, setPage, setLimit, setStatus } from "../../redux/eventsslice/eventsSlice";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { deleteEvent } from "../../api/CreateEventPost";
import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useState } from "react";

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

    const { events, page, limit, total, search, loading, status } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch, page, search, limit, status]);

    const addLifecycleStatus = (events) => {
        const now = new Date();

        return events.map(event => {
            const start = new Date(event.eventStartDate);
            const end = new Date(event.eventEndDate);
            let lifecycleStatus = "";

            if (now < start) lifecycleStatus = "upcoming";
            else if (now >= start && now <= end) lifecycleStatus = "live";
            else lifecycleStatus = "completed";

            return {
                ...event,
                lifecycleStatus
            };
        });
    };

    const eventsWithLifecycle = addLifecycleStatus(events);


    const filteredEvents =
        status === "all"
            ? eventsWithLifecycle
            : eventsWithLifecycle.filter(
                (event) => event.lifecycleStatus === status
            );


    // MAP API DATA → TABLE ROWS (CORRECT PLACE)
    const rows = filteredEvents.map((event, index) => ({
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
        actions: (
            <Box display="flex" gap={1} justifyContent="center">
                {/* View */}
                <InfoOutlinedIcon
                    sx={{ color: "#888afb", cursor: "pointer" }}
                    onClick={() =>
                        navigate(`/dashboardlayout/events/view/${event.id}`)
                    }
                />

                {/* Delete */}
                <DeleteOutlineIcon
                    sx={{ color: "red", cursor: "pointer" }}
                    onClick={() => {
                        setSelectedEventId(event.id);
                        setOpenDeleteDialog(true);
                    }}
                />

            </Box>
        ),
    }));
    const handleConfirmDelete = async () => {
        try {
            await deleteEvent(selectedEventId);

            dispatch(
                showSnackbar({
                    message: "Event deleted successfully",
                    severity: "success",
                })
            );

            dispatch(fetchEvents());
        } catch (error) {
            console.error("DELETE EVENT ERROR 👉", error);

            dispatch(
                showSnackbar({
                    message: "Failed to delete event",
                    severity: "error",
                })
            );
        } finally {
            setOpenDeleteDialog(false);
            setSelectedEventId(null);
        }
    };

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);


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
                            value={search}
                            onChange={(e) => dispatch(setSearch(e.target.value))}
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

            <Box mt={3}>

                <Tabs
                    value={status}
                    onChange={(e, newValue) => dispatch(setStatus(newValue))}
                    TabIndicatorProps={{ style: { display: "none" } }} // hide underline
                    textColor="inherit" // important! makes sx color work
                    sx={{
                        display: "inline-flex",      // shrink to content

                        bgcolor: "#fff",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                        borderRadius: 2,
                    }}
                >
                    <Tab
                        label="All"
                        value="all"
                        sx={{
                            textTransform: "none",
                            color: status === "all" ? "#000" : "#000",
                            fontWeight: status === "all" ? 600 : 400,
                            fontSize: "16px"
                        }}
                    />
                    <Tab
                        label="Live"
                        value="live"
                        sx={{
                            textTransform: "none",
                            color: status === "live" ? "#78e91c" : "#000",
                            fontWeight: status === "live" ? 600 : 400,
                            fontSize: "16px"

                        }}
                    />
                    <Tab
                        label="Upcoming"
                        value="upcoming"
                        sx={{
                            textTransform: "none",
                            color: status === "upcoming" ? "blue" : "#161515",
                            fontWeight: status === "upcoming" ? 600 : 400,
                            fontSize: "16px"

                        }}
                    />
                    <Tab
                        label="Completed"
                        value="completed"
                        sx={{
                            textTransform: "none",
                            color: status === "completed" ? "red" : "#161515",
                            fontWeight: status === "completed" ? 600 : 400,
                            fontSize: "16px"

                        }}
                    />
                </Tabs>




            </Box>
            <Box mt={2}>
                {loading ? (
                    <Typography>Loading events...</Typography>
                ) : (
                    <DataTable
                        columns={columns}
                        rows={rows}
                        page={page}
                        rowsPerPage={limit}
                        total={total}
                        onPageChange={(e, newPage) => dispatch(setPage(newPage))}
                        onRowsPerPageChange={(e) =>
                            dispatch(setLimit(parseInt(e.target.value, 10)))
                        }
                    />
                )}
            </Box>
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Delete Event</DialogTitle>

                <DialogContent>
                    Are you sure you want to delete this event?
                    This action cannot be undone.
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>
                        Cancel
                    </Button>

                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

export default Event;
