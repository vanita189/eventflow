import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import EventBasicInfo from "./EventBasicInfo";
import EventPackage from "./EventPackage";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function CreateEvents() {
    const [step, setStep] = useState(1);
    const [basicInfo, setBasicInfo] = useState({
        eventName: "",
        image: null,
        // location: null,
        startDate: null,
        endDate: null,
        capacity: "",
        tags: "",
        description: "",
    })

    
  const [basicInfoErrors, setBasicInfoErrors] = useState({});
  const [basicInfoCompleted, setBasicInfoCompleted] = useState(false);

  const validateBasicInfo = () => {
    const errors = {};

    if (!basicInfo.eventName) errors.eventName = "Event name is required";
    // if (!basicInfo.image) errors.image = "Event image is required";
    // if (!basicInfo.location) errors.location = "Location is required";
    if (!basicInfo.startDate) errors.startDate = "Start date is required";
    if (!basicInfo.endDate) errors.endDate = "End date is required";
    if (!basicInfo.capacity) errors.capacity = "Capacity is required";

    setBasicInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBasicInfoNext = () => {
    if (validateBasicInfo()) {
      setBasicInfoCompleted(true);
      setStep(1);
    }
  };
    return (
        <Box display="flex" justifyContent="center">
            {/* Shared width container */}
            <Box sx={{ width: { md: "80%", xs: "100%" } }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Create Event</Typography>
                    <Button>Event Name</Button>
                </Box>

                <Paper
                    elevation={2}
                    sx={{
                        width: "100%",     // ⬅️ takes same width as header
                        borderRadius: 2,
                    }}
                >
                    {/* Tabs */}
                    <Box p={2} sx={{ border: 1, borderColor: "divider" }}>
                        <Tabs
                            variant="fullWidth"
                            sx={{
                                borderBottom: 1.5,
                                borderColor: "divider",
                                justifyContent: "center",
                                display: "flex",
                                "& .MuiTab-root:focus": {
                                    outline: "none",
                                },

                            }}
                            value={step}
                            onChange={(_, value) => setStep(value)}
                        >
                            <Tab label="Basic Information" />
                            <Tab
                                label="Packages"
                                disabled={!basicInfoCompleted}
                            />
                        </Tabs>

                        <Box p={2}>
                            {step === 0 && (
                                <EventBasicInfo
                                    values={basicInfo}
                                    setValues={setBasicInfo}
                                    errors={basicInfoErrors}
                                    onNext={handleBasicInfoNext}
                                />
                            )}

                            {step === 1 && <EventPackage />}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default CreateEvents;
