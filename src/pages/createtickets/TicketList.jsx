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
import { getTickets, getTicketByEvent, getTicketById } from "../../api/CreateTicket";
import dayjs from "dayjs";

const columns = [
    { id: "slNo", label: "Sl No" },
    { id: "ticketId", label: "Ticket ID" },
    { id: "eventName", label: "Event Name" },
    { id: "buyerName", label: "Customer Name" },
    { id: "ticketTypes", label: "Tickets" },
    { id: "totalAmount", label: "Amount (₹)" },
    { id: "createdAt", label: "Booked On" },
    { id: "actions", label: "Action" },
];

function TicketList() {
    const [selectedEvent, setSelectedEvent] = useState("");
    const [loading, setLoading] = useState(false)
    const [tickets, setTickets] = useState([])
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { events } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    const rows = tickets.map((ticket, index) => {
        const event = events.find(e => e.id === ticket.event_id);

        return {
            slNo: index + 1,
            ticketId: ticket.ticket_code || ticket.id,
            eventName: event?.eventName || "N/A",
            buyerName: ticket.name,
            ticketTypes: ticket.tickets.map(t => `${t.package_name} (${t.quantity})`).join(", "),
            totalAmount: ticket.total_amount,
            createdAt: dayjs(ticket.created_at).format("DD MMM YYYY, hh:mm A"),
            actions: "View",
        };
    });

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const res = await getTickets();
                setTickets(res.data)
            } catch (error) {
                console.error(error)
                dispatch(showSnackbar({
                    message: "Failed to fetch tickets",
                    severity: "error"
                }))
            } finally {
                setLoading(false)
            }
        }
        fetchTickets()
    }, [])


    useEffect(() => {

        const fetchTicketsByEvent = async () => {
            try {
                setLoading(true);
                let res;
                if (selectedEvent) {
                    // fetch by selected event
                    res = await getTicketByEvent(selectedEvent);
                    setTickets(res);

                } else {
                    // fetch all tickets
                    const all = await getTickets();
                    setTickets(all.data);

                }

            } catch (error) {
                console.error(error);
                dispatch(showSnackbar({
                    message: "Failed to fetch the tickets by event",
                    severity: "error"
                }))
            } finally {
                setLoading(false)
            }
        }
        fetchTicketsByEvent()
    }, [selectedEvent])
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
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            sx={{ minWidth: 200 }}
                            SelectProps={{
                                displayEmpty: true, // 👈 important to show empty value
                                renderValue: (selected) => {
                                    if (selected === "") return "All Events"; // 👈 display All Events for empty
                                    const event = events.find((e) => e.id === selected);
                                    return event ? event.eventName : "All Events";
                                },
                            }}
                        >
                            <MenuItem value="">All Events</MenuItem> {/*  add this */}

                            {events.map((event) => (
                                <MenuItem key={event.id} value={event.id}>
                                    {event.eventName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Stack>

                <Stack>
                    <PrimaryButton onClick={() => navigate("/dashboardlayout/ticket/create")}>+ Create Ticket</PrimaryButton>
                </Stack>

            </Stack>
            <Stack>
                <Box mt={2}>
                    {loading ? (
                        <Typography>Loading events...</Typography>
                    ) : (
                        <DataTable
                            columns={columns}
                            rows={rows}
                            page={10}
                            rowsPerPage={10}
                            total={selectedEvent.length}
                            onPageChange={(e, newPage) => dispatch(setPage(newPage))}
                            onRowsPerPageChange={(e) =>
                                dispatch(setLimit(parseInt(e.target.value, 10)))
                            }
                        />
                    )}
                </Box>
            </Stack>


        </Stack>
    )
}

export default TicketList