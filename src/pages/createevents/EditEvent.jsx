import { Stack, Box, Paper, Typography, Tabs, Tab } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import { useState } from "react";
import EditEventBasicInfo from "./EditEventBasicInfo";
import EditEventPackages from "./EditPackageInfo";

function EditEvent() {
    const [step, setStep] = useState(1);
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
                            <Tabs variant="fullWidth" sx={{ borderBottom: "1px solid #ccc" , mb:3 }} value={step} onChange={handleTabChange} >
                                <Tab label="Edit Event Basic Info" sx={{ fontWeight: 600 }} />
                                <Tab label="Edit Event Packages" sx={{ fontWeight: 600 }} />
                            </Tabs>

                            {step === 0 && (
                                <EditEventBasicInfo
                                    eventDetails={eventDetails}
                                    setEventDetails={setEventDetails}
                                    errors={errors}
                                    setStep={setStep}
                                    validateBasicInfo={validateBasicInfo}
                                />
                            )}

                            {step === 1 && (
                                <EditEventPackages
                                    packageDetails={packageDetails}
                                    setPackageDetails={setPackageDetails}
                                    setStep={setStep}
                                    // onSubmit={handleUpdateEvent}
                                />
                            )}
                        </Paper>
                    </Stack>
                </Stack>
            </Stack>
        </form>
    )

}
export default EditEvent;