import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import EventIcon from "@mui/icons-material/Event";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import PrimaryButton from "../../components/PrimaryButton"
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import EventPackage from "./EventPackage";
import EventBasicInfo from "./EventBasicInfo"
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/snackbar/snackbarSlice"
import { createEvent } from "../../api/CreateEventPost";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../redux/eventsslice/eventsSlice";
import { uploadImage } from "../../utils/uploadImage";

function CreateEvents() {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)
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
        eventDescription: ""
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
            eventDetails.eventTags &&
            eventDetails.eventDescription
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
        if (newValue === 1 && !isBasicInfoValid()) {
            dispatch(showSnackbar({
                message: "Please Complete Event Basic Information first",
                severity: "warning"
            }))
            return
        }
        setStep(newValue)
    }

    // useEffect(() => {
    //     console.log("Event Details Updated 👉", eventDetails);
    // }, [eventDetails]);

    // useEffect(() => {
    //     console.log("package Details Updated 👉", packageDetails);
    // }, [packageDetails]);

    const handleSubmitEvent = async () => {
        if (loading) return; // ✅ prevents multiple clicks
        let imageUrl = "";
        if (eventDetails.eventImage) {
            imageUrl = await uploadImage(eventDetails.eventImage);
            console.log("IMAGE URL:", imageUrl); // 👈 YOU WILL SEE THIS
        }

        try {
            setLoading(true);

            const payload = {
                eventName: eventDetails.eventName,
                eventImage: imageUrl,
                // typeof eventDetails.eventImage === "string"
                //     ? eventDetails.eventImage
                //     : "https://placehold.co/600x400",

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

                // ✅ MUST BE OBJECT
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

            console.log("FINAL PAYLOAD 👉", payload);

            const response = await createEvent(payload); // POST API
            await dispatch(fetchEvents());

            if (response?.status === 201 || response?.status === 200) {
                dispatch(
                    showSnackbar({
                        message: "Event created successfully",
                        severity: "success",
                    })
                );

                //  navigate ONLY after success
                navigate("/dashboardlayout/events", { replace: true });
            }
        } catch (error) {
            console.error("CREATE EVENT ERROR 👉", error);
            dispatch(showSnackbar({
                message: "Failed to create event",
                severity: "error",
            }));
        } finally {
            setLoading(false);
        }
    };

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <Stack sx={{ display: "flex", alignItems: "center" }} >
                <Stack sx={{ maxWidth: { lg: "80%", md: "100%" }, width: "100%" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <EventIcon />
                            <Typography variant="h6" fontWeight={500} color="#5866f8ff">
                                Create Event
                            </Typography>
                        </Box>



                    </Box>

                    <Paper sx={{
                        p: "16px 32px", // top-bottom | left-right
                        border: "0.5px solid #cfcbcbff", borderRadius: 2
                    }}>
                        <Box sx={{ borderBottom: "1px solid #ccc" }}>
                            <Tabs value={step} onChange={handleTabChange} variant="fullWidth">
                                <Tab sx={{ fontWeight: 600 }} label=" Event Basic Information" />
                                <Tab sx={{ fontWeight: 600 }} label="Event Package Information" />

                            </Tabs>
                        </Box>

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
        </form>
    )
}

export default CreateEvents;