import { Stack, Box, Paper, Typography, Tabs, Tab } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import { useState } from "react";
import EditEventBasicInfo from "./EditEventBasicInfo";
import EditEventPackages from "./EditPackageInfo";

function EditEvent() {
    const [step, setStep] = useState(0);

    const handleTabChange = (event, newValue) => {
        setStep(newValue);
    }
    return (
        <Stack alignItems="center">
            <Stack spacing={2} maxWidth={{ xs: "100%", md: "80%" }} width="100%" >
                <Stack display="flex" flexDirection="row" alignItems="center" gap={1}>
                    <EventIcon sx={{ color: "#5e53f0" }} />
                    <Typography fontWeight={600} color="#5e53f0" fontSize={20}>Edit Event</Typography>
                </Stack>
                <Stack>
                    <Paper sx={{ padding: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                        <Tabs variant="fullWidth" sx={{ borderBottom: "1px solid #ccc" }} value={step} onChange={handleTabChange}>
                            <Tab label="Edit Event Basic Info" sx={{ fontWeight: 600 }} />
                            <Tab label="Edit Event Packages" sx={{ fontWeight: 600 }} />
                        </Tabs>

                        {step === 0 && (
                            <EditEventBasicInfo />
                        )}

                        {step === 1 && (
                            <EditEventPackages />
                        )}
                    </Paper>
                </Stack>
            </Stack>
        </Stack>

    )

}
export default EditEvent;