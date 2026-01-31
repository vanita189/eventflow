import { Typography, Box, Paper, Stack, TextField, MenuItem } from "@mui/material";
import { useEffect } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, setSearch, setPage, setLimit, setStatus } from "../../redux/eventsslice/eventsSlice"; import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
import { useState } from "react";
import { createTicket } from "../../api/CreateTicket";

function CreateTicket() {
    const [selectedEvent, setSelectedEvent] = useState("");
    const [loading, setLoading] = useState(false)
    const [countryCode, setCountryCode] = useState("+91")
    const [phone, setPhone] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [counts, setCounts] = useState({});

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { events } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    useEffect(() => {
        if (events.length > 0 && !selectedEvent) {
            setSelectedEvent(events[0].id);
        }
    }, [events]);

    useEffect(() => {
        setCounts({});
    }, [selectedEvent]);


    const selectedEventData = events.find(e => e.id === Number(selectedEvent));
    const packages = selectedEventData?.packages?.list || [];

    if (!selectedEventData) {
        return <Typography>Loading event data...</Typography>;
    }


    const handleIncrease = (index) => {
        setCounts((prev) => ({
            ...prev,
            [index]: (prev[index] || 0) + 1,
        }));
    };

    const handleDecrease = (index) => {
        setCounts((prev) => ({
            ...prev,
            [index]: Math.max((prev[index] || 0) - 1, 0),
        }));
    };

    const totalAmount = packages.reduce((sum, pkg, index) => {
        const qty = counts[index] || 0;
        return sum + qty * pkg.price;
    }, 0);



    const validationForm = () => {
        if (!selectedEvent) return "Please Select Event";

        if (!phone || phone.length !== 10) return "Enter valid phone number"
        if (/^0/.test(phone)) return "Phone number cannot start with 0";


        if (!email || !/\S+@\S+\.\S+/.test(email)) return "Enter valid email"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Invalid email format";

        if (!name.trim()) return "Enter your name"
        if (name.length < 3) return "Name must be at least 3 characters";

        const selectedPackages = packages.filter((pkg, index) => (counts[index] || 0) > 0);

        if (selectedPackages.length === 0) {
            return "Please select at least one ticket";
        }


        return null;
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const error =  validationForm();
        if(error){
            dispatch(showSnackbar({message:error, severity:"error"}));
            return
        }

        try{
            setLoading(true);
            const selectedPackages = packages.map((pkg,index) => ({
                package_id:pkg.id,
                package_name:pkg.packageName,
                price:pkg.price,
                quantity:counts[index] || 0,
                total:(counts[index] || 0) * pkg.price

            }))
            .filter(item => item.quantity > 0)

            const payload = {
                event_id:Number(selectedEvent),
                name,
                phone:countryCode + phone,
                email,
                tickets:selectedPackages,
                total_amount:totalAmount,

            };
            await createTicket(payload);

            dispatch(showSnackbar({
                message:"Ticket created succesfully",
                severity:"success"
            }))

            navigate("/dashboardlayout/ticket")
        } catch(err) {
            console.error(err);
            dispatch(showSnackbar({
                message:"Failed to create ticket",
                severity:"error"
            }))
        }
        finally {
            setLoading(false)
        }
    }
    return (

        <Stack>

            <Box mb={3} mt={1}>
                <Typography fontSize={20} fontWeight={700}>
                    Create Ticket
                </Typography>
            </Box>

            <Stack direction="row" gap={3} alignItems="flex-start">

                <Stack sx={{ maxWidth: { lg: "70%", md: "100%" }, width: "100%" }} >
                    <form onSubmit={handleSubmit}>
                        <Box>
                            <Paper
                                sx={{
                                    p: "24px 28px",
                                    borderRadius: "16px",
                                    border: "1px solid rgba(131,56,236,0.15)",
                                    background: "linear-gradient(180deg, #ffffff 0%, #faf7ff 100%)",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                                    overflowY: "auto",
                                    height: "75vh",

                                    "&::-webkit-scrollbar": {
                                        width: "6px",
                                    },
                                    "&::-webkit-scrollbar-track": {
                                        background: "transparent",
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        background: "#8338EC",
                                        borderRadius: "20px",
                                    },
                                    "&::-webkit-scrollbar-thumb:hover": {
                                        background: "#5a20c9",
                                    },
                                }}
                            >
                                <Stack spacing={2.2}>
                                    {/* Choose Event */}
                                    <Box>
                                        <Typography fontSize={13} fontWeight={600} color="#555">
                                            Choose Event
                                        </Typography>

                                        <TextField
                                            select
                                            fullWidth
                                            value={selectedEvent}
                                            onChange={(e) => setSelectedEvent(e.target.value)}
                                            SelectProps={{ displayEmpty: true }}
                                            sx={{
                                                mt: 0.5,
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "12px",
                                                    background: "#fff",
                                                },
                                            }}
                                        >
                                            <MenuItem value="" disabled>
                                                Select the event
                                            </MenuItem>
                                            {events.map((event) => (
                                                <MenuItem key={event.id} value={event.id}>
                                                    {event.eventName}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>

                                    {/* Phone + Email */}
                                    <Box display="flex" gap={2}>
                                        <Box flex={1}>
                                            <Typography fontSize={13} fontWeight={600} color="#555">
                                                Phone Number
                                            </Typography>

                                            <Box display="flex" gap={1} mt={0.5}>
                                                <TextField
                                                    select
                                                    value={countryCode}
                                                    onChange={(e) => setCountryCode(e.target.value)}
                                                    sx={{
                                                        width: 110,
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: "12px",
                                                            background: "#fff",
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="+91">+91</MenuItem>
                                                    <MenuItem value="+1">+1</MenuItem>
                                                    <MenuItem value="+44">+44</MenuItem>
                                                </TextField>

                                                <TextField
                                                    fullWidth
                                                    type="tel"
                                                    placeholder="Enter phone number"
                                                    value={phone}
                                                    onChange={(e) =>
                                                        setPhone(e.target.value.replace(/\D/g, ""))
                                                    }
                                                    inputProps={{ maxLength: 10 }}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: "12px",
                                                            background: "#fff",
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        <Box flex={1}>
                                            <Typography fontSize={13} fontWeight={600} color="#555">
                                                Email
                                            </Typography>
                                            <TextField
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                fullWidth
                                                type="email"
                                                placeholder="Enter your email"
                                                sx={{
                                                    mt: 0.5,
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: "12px",
                                                        background: "#fff",
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Name */}
                                    <Box>
                                        <Typography fontSize={13} fontWeight={600} color="#555">
                                            Enter Name
                                        </Typography>
                                        <TextField
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter the name"
                                            fullWidth
                                            sx={{
                                                mt: 0.5,
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "12px",
                                                    background: "#fff",
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Tickets */}
                                    <Box>
                                        <Typography fontSize={15} fontWeight={700} color="#222" mb={1}>
                                            Regular Tickets
                                        </Typography>

                                        {packages.map((pkg, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    border: "1px solid rgba(131,56,236,0.2)",
                                                    borderRadius: "14px",
                                                    p: 2,
                                                    mb: 1.5,
                                                    background: "#fff",
                                                    transition: "0.2s ease",
                                                    "&:hover": {
                                                        boxShadow: "0 6px 18px rgba(131,56,236,0.15)",
                                                        transform: "translateY(-2px)",
                                                    },
                                                }}
                                            >
                                                <Typography fontWeight={700} fontSize={14}>
                                                    {pkg.packageName}
                                                </Typography>

                                                <Box display="flex" justifyContent="space-between" mt={1}>
                                                    {/* Left */}
                                                    <Box>
                                                        <Typography fontSize={12} color="#777">
                                                            Coupon Amount
                                                        </Typography>
                                                        <Typography fontWeight={600}>₹{pkg.price}</Typography>
                                                    </Box>

                                                    {/* Right Counter */}
                                                    <Box textAlign="right">
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            {/* Minus */}
                                                            <Typography
                                                                onClick={() => handleDecrease(index)}
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    width: 28,
                                                                    height: 28,
                                                                    borderRadius: "50%",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    border: "1px solid #8338EC",
                                                                    color: "#8338EC",
                                                                    fontWeight: 700,
                                                                    transition: "0.2s",
                                                                    "&:hover": {
                                                                        background: "#8338EC",
                                                                        color: "#fff",
                                                                    },
                                                                }}
                                                            >
                                                                -
                                                            </Typography>

                                                            <Typography fontWeight={700}>
                                                                {counts[index] || 0}
                                                            </Typography>

                                                            {/* Plus */}
                                                            <Typography
                                                                onClick={() => handleIncrease(index)}
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    width: 28,
                                                                    height: 28,
                                                                    borderRadius: "50%",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    border: "1px solid #8338EC",
                                                                    color: "#8338EC",
                                                                    fontWeight: 700,
                                                                    transition: "0.2s",
                                                                    "&:hover": {
                                                                        background: "#8338EC",
                                                                        color: "#fff",
                                                                    },
                                                                }}
                                                            >
                                                                +
                                                            </Typography>
                                                        </Box>

                                                        <Typography mt={0.8} fontSize={12} color="#555">
                                                            Total ₹{(counts[index] || 0) * pkg.price}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>


                                    {/* Buttons */}
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        sx={{

                                            pt: 1,
                                        }}
                                    >
                                        <PrimaryButton type="button" onClick={() => navigate(-1)}>Cancel</PrimaryButton>
                                        <PrimaryButton disabled={loading} type="submit"
                                            onClick={() => {
                                                const error = validationForm();
                                                if (error) {
                                                    dispatch(showSnackbar({ message: error, severity: "error" }))
                                                    return
                                                }
                                            }}

                                        >  {loading ? "Creating..." : "Create Ticket"}
                                        </PrimaryButton>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Box>
                    </form>

                </Stack>
                <Stack width="340px">
                    <Paper
                        sx={{
                            p: 2,
                            border: "0.5px solid #cfcbcbff",
                            borderRadius: 2,
                            position: "sticky",
                            top: 20,
                        }}
                    >
                        <Typography fontWeight="bold" mb={2}>
                            Ticket Summary
                        </Typography>

                        {packages.map((pkg, index) => {
                            const qty = counts[index] || 0;
                            if (qty === 0) return null;

                            return (
                                <Box
                                    key={index}
                                    display="flex"
                                    justifyContent="space-between"
                                    mb={1}
                                >
                                    <Typography>
                                        {pkg.packageName} × {qty}
                                    </Typography>
                                    <Typography>₹{qty * pkg.price}</Typography>
                                </Box>
                            );
                        })}

                        <Box mt={2} borderTop="1px solid #ddd" pt={1}>
                            <Typography fontWeight="bold" display="flex" justifyContent="space-between">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </Typography>
                        </Box>
                    </Paper>
                </Stack>

            </Stack>
        </Stack >
    )
}

export default CreateTicket;