import { Stack, Box, Typography, TextField, InputAdornment, MenuItem } from "@mui/material"
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SearchIcon from "@mui/icons-material/Search";
import { useEffect } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, setSearch, setPage, setLimit, setStatus } from "../../redux/eventsslice/eventsSlice"; import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
import { useState } from "react";
import DataTable from "../../components/DataTable";

const columns = [
    { id: "slNo", label: "Sl No" },
    { id: "eventName", label: "Event Name" },
    { id: "eventStartDate", label: "Start Date" },
    { id: "eventEndDate", label: "End Date" },
    { id: "ticketWindow", label: "Ticket Window" },
    { id: "eventCapacity", label: "Event Capacity" },
    { id: "actions", label: "Action" },
];

function TicketList() {
    const [selectedEvent, setSelectedEvent] = useState("");
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { events } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);
    return (
        <Stack spacing={2}>
            <Stack>
                <Box display={"flex"} gap={1} textAlign={"center"} alignItems={"center"} >
                    <ConfirmationNumberIcon />
                    <Typography fontSize={20}  > Tickets</Typography>
                </Box>
            </Stack>
            <Stack display={"flex"} flexDirection={"row"} justifyContent={"space-between"} >
                <Stack display={"flex"} flexDirection={"row"} gap={2} >
                    <Box>
                        <TextField
                            placeholder="Search Tickets"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box>
                        <TextField
                            select
                            label="Select Event"
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            sx={{ minWidth: 200 }}
                        >
                            {events.map((event) => (
                                <MenuItem key={event.id} value={event.id}>
                                    {event.eventName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Stack>

                <Stack>
                    <PrimaryButton onClick={()=>navigate("/dashboardlayout/ticket/create")}>+ Create Ticket</PrimaryButton>
                </Stack>

            </Stack>
            <Stack>
                <Box>
                    {
                        loading ? (
                            <Typography>Loading Tickets</Typography>
                        ) : (
                            <TextField/>
                        )
                    }
                </Box>
            </Stack>


        </Stack>
    )
}

export default TicketList