import { Stack, Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { useEffect, useState } from "react";
import EventPackage from "./EventPackage";
import EventBasicInfo from "./EventBasicInfo";
import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getEventsById, updateEvent } from "../../api/CreateEventPost";
import dayjs from "dayjs";

function EditEvent() {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
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
    });
    const [packageDetails, setPackageDetails] = useState([]);

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
            eventDetails.eventTags &&
            eventDetails.eventDescription
        )
    }

    const [errors, setErrors] = useState({});
    const validateBasicInfo = () => {
        const newErrors = {}

        const {
            eventStartDate,
            eventEndDate,
            ticketStartDate,
            ticketEndDate
        } = eventDetails

        if (!eventDetails.eventName) newErrors.eventName = "Event name is required";
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
        if (!id) return;

        const fetchEvent = async () => {
            try {
                setLoading(true);
                const data = await getEventsById(id);
                console.log("EventEDIT API Response:", data);

                setEventDetails({
                    eventName: data.eventName || "",
                    eventImage: null,

                    eventLocation: data.eventLocation
                        ? { address: data.eventLocation }
                        : null,

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

                    eventCapacity: data.eventCapacity || "",
                    eventTags: data.eventTags || "",
                    eventDescription: data.eventDescription || "",
                });

                setPackageDetails(
                    data.packages?.list?.map(pkg => ({
                        id: pkg.id ?? crypto.randomUUID(),
                        packageName: pkg.packageName,
                        price: pkg.price,
                        allowedPersons: pkg.allowedPersons,
                        quantity: pkg.quantity,
                        description: pkg.description,
                    })) || []
                );


            } catch (err) {
                dispatch(showSnackbar({
                    message: "Failed to fetch event details",
                    severity: "error"
                }));
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);


    const handleUpdateEvent = async () => {
        try {
            setLoading(true);

            const payload = {
                event_name: eventDetails.eventName,
                location: eventDetails.eventLocation,
                start_date: eventDetails.eventStartDate,
                end_date: eventDetails.eventEndDate,
                ticket_start_date: eventDetails.ticketStartDate,
                ticket_end_date: eventDetails.ticketEndDate,
                capacity: eventDetails.eventCapacity,
                tags: eventDetails.eventTags,
                description: eventDetails.eventDescription,
                packages: packageDetails,
            };

            // If image is a File → multipart
            const formData = new FormData();
            Object.keys(payload).forEach(key => {
                formData.append(key, payload[key]);
            });

            if (eventDetails.eventImage instanceof File) {
                formData.append("image", eventDetails.eventImage);
            }

            await updateEvent(id, formData);

            dispatch(showSnackbar({
                message: "Event updated successfully",
                severity: "success"
            }));
        } catch (err) {
            dispatch(showSnackbar({
                message: "Failed to update event",
                severity: "error"
            }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("EVENT DETAILS STATE:", eventDetails);
    }, [eventDetails]);

    useEffect(() => {
        console.log(" PACKAGE DETAILS STATE:", packageDetails);
    }, [packageDetails]);

    return (
        <form>
            <Stack sx={{ display: "flex", alignItems: "center" }}>
                <Stack sx={{ maxWidth: { lg: "80%", xs: "100%" }, width: "100%" }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2} mt={1}>
                        <EventIcon />
                        <Typography variant="h6" fontWeight={500} color="#5866f8ff">Edit Event</Typography>
                    </Box>

                    <Paper sx={{
                        p: "16px 32px",
                        border: "0.5px solid #cfcbcbff"
                    }}>
                        <Box sx={{ borderBottom: "1px solid #ccc" }}>
                            <Tabs variant="fullWidth" value={step} onChange={handleTabChange}>
                                <Tab sx={{ fontWeight: 600 }} label="Event Basic Information" />
                                <Tab sx={{ fontWeight: 600 }} label="Event Packages Information" />
                            </Tabs>
                        </Box>

                        <Box>
                            {step === 0 && (
                                <EventBasicInfo
                                    eventDetails={eventDetails}
                                    setEventDetails={setEventDetails}
                                    setStep={setStep}
                                    validateBasicInfo={validateBasicInfo}
                                    errors={errors}
                                />
                            )}

                            {step === 1 && (
                                <EventPackage
                                    packageDetails={packageDetails}
                                    setPackageDetails={setPackageDetails}
                                    setStep={setStep}
                                    onSubmit={handleUpdateEvent}

                                />
                            )}
                        </Box>
                    </Paper>
                </Stack>


            </Stack>
        </form>
    )
}
export default EditEvent;