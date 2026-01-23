import { Stack, Box, Paper, Typography, Tabs, Tab } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import { useState, useEffect } from "react";
import EventBasicInfo from "./EventBasicInfo";
import EventPackage from "./EventPackage";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { showSnackbar } from "../../redux/snackbar/snackbarSlice"
import { getEventsById, updateEvent } from "../../api/CreateEventPost";
function EditEvent() {
    const { id } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [eventDetails, setEventDetails] = useState({
        eventName: "",
        eventImage: null,
        eventLocation: null,
        eventStartDate: null,
        eventEndDate: null,
        ticketStartDate: null,
        ticketEndDate: null,
        eventCapacity: "",
        eventTags: "",
        eventDescription: "",

    })
    const [packageDetails, setPackageDetails] = useState([])

    const isBasicInfoValid = () => {
        return (
            eventDetails.eventName &&
            eventDetails.eventImage &&
            eventDetails.eventLocation &&
            eventDetails.eventStartDate &&
            eventDetails.eventEndDate &&
            eventDetails.ticketStartDate &&
            eventDetails.ticketEndDate &&
            eventDetails.eventCapacity &&
            eventDetails.eventTags
        )
    }

    const [errors, setErrors] = useState({})

    const validateBasicInfo = () => {
        const newErrors = {}

        const {
            eventStartDate,
            eventEndDate,
            ticketStartDate,
            ticketEndDate
        } = eventDetails

        if (!eventDetails.eventName)
            newErrors.eventName = "Event Name is required"
        if (!eventDetails.eventImage)
            newErrors.eventImage = "Event image is required";

        if (!eventDetails.eventLocation)
            newErrors.eventLocation = "Event location is required";

        if (!eventDetails.eventCapacity)
            newErrors.eventCapacity = "Event capacity is required";

        if (!eventDetails.eventTags)
            newErrors.eventTags = "Event tags are required";

        if (!eventDetails.eventDescription)
            newErrors.eventDescription = "Event description is required";

        //date validations
        // Event dates
        if (eventStartDate && eventEndDate && eventEndDate < eventStartDate) {
            newErrors.eventEndDate = "Event end date must be after start date";
        }

        // Ticket vs Event
        if (ticketStartDate && eventStartDate && ticketStartDate > eventStartDate) {
            newErrors.ticketStartDate =
                "Ticket start date must be before event start date";
        }

        if (ticketEndDate && eventEndDate && ticketEndDate > eventEndDate) {
            newErrors.ticketEndDate =
                "Ticket end date must be before or equal to event end date";
        }

        // Ticket range
        if (ticketStartDate && ticketEndDate && ticketEndDate < ticketStartDate) {
            newErrors.ticketEndDate =
                "Ticket end date must be after ticket start date";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0
    }
    const handleTabChange = (event, newValue) => {
        setStep(newValue);
    }

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);

                const data = await getEventsById(id);
                console.log("EVENT DATA 👉", data);

                if (!data) return;

                setEventDetails({
                    eventName: data.eventName ?? "",
                    eventImage: data.eventImage ?? null,
                    eventLocation: data.eventLocation ?? null,

                    eventStartDate: data.eventStartDate
                        ? dayjs(data.eventStartDate)
                        : null,

                    eventEndDate: data.eventEndDate
                        ? dayjs(data.eventEndDate)
                        : null,

                    ticketStartDate: data.ticketStartDate
                        ? dayjs(data.ticketStartDate)
                        : null,

                    ticketEndDate: data.ticketEndDate
                        ? dayjs(data.ticketEndDate)
                        : null,

                    eventCapacity: data.eventCapacity ?? "",
                    eventTags: data.eventTags ?? "",
                    eventDescription: data.eventDescription ?? "",
                });


                setPackageDetails(data.packages?.list ?? []);
            } catch (error) {
                console.error("FETCH EVENT ERROR 👉", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEvent();
    }, [id]);

    const handleSubmitEvent = async () => {
        if (loading) return;

        try {
            setLoading(true);

            let imageUrl = eventDetails.eventImage;

            // upload ONLY if user selected a new file
            if (eventDetails.eventImage instanceof File) {
                imageUrl = await uploadImage(eventDetails.eventImage);
            }

            const payload = {
                eventName: eventDetails.eventName,

                // keep old image if not changed
                eventImage: imageUrl,

                eventLocation: eventDetails.eventLocation?.address || "Unknown",

                eventStartDate: eventDetails.eventStartDate
                    ? eventDetails.eventStartDate.toISOString()
                    : null,

                eventEndDate: eventDetails.eventEndDate
                    ? eventDetails.eventEndDate.toISOString()
                    : null,

                ticketStartDate: eventDetails.ticketStartDate
                    ? eventDetails.ticketStartDate.toISOString()
                    : null,

                ticketEndDate: eventDetails.ticketEndDate
                    ? eventDetails.ticketEndDate.toISOString()
                    : null,

                eventCapacity: Number(eventDetails.eventCapacity),
                eventTags: eventDetails.eventTags,
                eventDescription: eventDetails.eventDescription,

                packages: {
                    list: packageDetails.map(pkg => ({
                        packageName: pkg.packageName,
                        price: Number(pkg.price),
                        allowedPersons: Number(pkg.allowedPersons),
                        quantity: Number(pkg.quantity),
                        description: pkg.description,
                    })),
                },

                status: "draft",
            };

            console.log("UPDATE PAYLOAD 👉", payload);

            const response = await updateEvent(id, payload); // ✅ PUT API

            if (response?.status === 200) {
                dispatch(
                    showSnackbar({
                        message: "Event updated successfully",
                        severity: "success",
                    })
                );

                navigate("/dashboardlayout/events", { replace: true });
            }
        } catch (error) {
            console.error("UPDATE EVENT ERROR 👉", error);
            dispatch(
                showSnackbar({
                    message: "Failed to update event",
                    severity: "error",
                })
            );
        } finally {
            setLoading(false);
        }
    };






    // useEffect(() => {
    //     console.log("EVENT DETAILS STATE 👉", eventDetails);
    // });
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <Stack alignItems="center">
                <Stack spacing={2} maxWidth={{ xs: "100%", md: "80%" }} width="100%" >
                    <Stack display="flex" flexDirection="row" alignItems="center" gap={1}>
                        <EventIcon sx={{ color: "#5e53f0" }} />
                        <Typography fontWeight={600} color="#5e53f0" fontSize={20}>Edit Event</Typography>
                    </Stack>
                    <Stack>
                        <Paper sx={{ padding: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                            <Tabs variant="fullWidth" sx={{ borderBottom: "1px solid #ccc", mb: 3 }} value={step} onChange={handleTabChange} >
                                <Tab label="Edit Event Basic Info" sx={{ fontWeight: 600 }} />
                                <Tab label="Edit Event Packages" sx={{ fontWeight: 600 }} />
                            </Tabs>

                            <Box mt={2}>
                                {step === 0 &&
                                    <EventBasicInfo
                                        eventDetails={eventDetails}
                                        setEventDetails={setEventDetails}
                                        setStep={setStep}
                                        validateBasicInfo={validateBasicInfo}
                                        errors={errors}
                                    />
                                }
                                {step === 1 &&
                                    <EventPackage
                                        packageDetails={packageDetails}
                                        setPackageDetails={setPackageDetails}
                                        setStep={setStep}
                                        onSubmit={handleSubmitEvent}

                                    />
                                }
                            </Box>
                        </Paper>
                    </Stack>
                </Stack>
            </Stack>
        </form>
    )

}
export default EditEvent;