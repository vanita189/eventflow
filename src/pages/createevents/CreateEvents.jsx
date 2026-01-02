import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import EventIcon from "@mui/icons-material/Event";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import PrimaryButton from "../../components/PrimaryButton"
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import EventPackage from "./EventPackage";
import EventBasicInfo from "./EventBasicInfo"

function CreateEvents() {
    const [step, setStep] = useState(0)
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

    const handleTabChange = (event, newValue) => {
        setStep(newValue)
    }
    return (
        <form>
            <Stack sx={{ display: "flex", alignItems: "center" }} >
                <Stack sx={{ maxWidth: { lg: "80%", md: "100%" }, width: "100%" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <EventIcon />
                            <Typography variant="h6" fontWeight={500} color="#5866f8ff">
                                Create Event
                            </Typography>
                        </Box>

                        <PrimaryButton>
                            Current Event
                        </PrimaryButton>

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
                            {step === 0 && <EventBasicInfo eventDetails={eventDetails} setEventDetails={setEventDetails} />}
                            {step === 1 && <EventPackage packageDetails={packageDetails} setPackageDetails={setPackageDetails} />}
                        </Box>
                    </Paper>
                </Stack>
            </Stack>
        </form>
    )
}

export default CreateEvents;