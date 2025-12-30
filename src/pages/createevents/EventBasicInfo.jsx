import { useState } from "react";
import { Stack, TextField, Typography, Box } from "@mui/material";
import PrimaryButton from "../../components/PrimaryButton";
import EventImageUpload from "../../components/EventImageUpload";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import EventLocationPicker from "../../components/EventLocationPicker";
import  Editor  from "../../components/Editor"

function EventBasicInfo() {
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [location, setLocation] = useState(null);

    return (
        <Stack
            spacing={2}
            width="100%"
            sx={{ overflowX: "hidden" }} // corrected
        >
            <Stack flexDirection={{ xs: "column", md: "row" }} spacing={2} gap={5} width="100%">
                <Stack spacing={2} flex={1} minWidth={0}>
                    {/* Event Name */}
                    <Stack spacing={1} width="100%">
                        <Typography fontWeight={700}>Event Name</Typography>
                        <TextField
                            placeholder="Event Name"
                            name="eventName"
                            required
                            fullWidth
                        />
                    </Stack>

                    {/* Upload Image */}
                    <Stack spacing={1} width="100%">
                        <Typography fontWeight={700}>Upload Image</Typography>
                        <Box>
                            <EventImageUpload />
                        </Box>
                    </Stack>
                </Stack>

                {/* Event Location */}
                <Stack spacing={1} flex={1} minWidth={0}>
                    <Typography fontWeight={700}>Event Location</Typography>
                    <EventLocationPicker
                        onLocationSelect={(loc) => setLocation(loc)}
                    />
                </Stack>
            </Stack>

            {/* Start & End Date */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    gap={5}
                    width="100%"
                >
                    <Stack spacing={1} flex={1} minWidth={0}>
                        <Typography fontWeight={700}>Start Date & Time</Typography>
                        <DateTimePicker
                            value={startDate}
                            onChange={setStartDate}
                            renderInput={(props) => <TextField {...props} fullWidth />}
                        />
                    </Stack>

                    <Stack spacing={1} flex={1} minWidth={0}>
                        <Typography fontWeight={700}>End Date & Time</Typography>
                        <DateTimePicker
                            value={endDate}
                            onChange={setEndDate}
                            renderInput={(props) => <TextField {...props} fullWidth />}
                        />
                    </Stack>
                </Stack>
            </LocalizationProvider>

            {/* Capacity & Tags */}
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                gap={5}
                width="100%"
            >
                <Stack spacing={1} flex={1} minWidth={0}>
                    <Typography fontWeight={700}>Total Capacity</Typography>
                    <TextField
                        type="number"
                        name="capacity"
                        fullWidth
                    />
                </Stack>

                <Stack spacing={1} flex={1} minWidth={0}>
                    <Typography fontWeight={700}>Event Tags (comma separated)</Typography>
                    <TextField
                        name="tags"
                        fullWidth
                    />
                </Stack>
            </Stack>
            <Stack>
                <Editor/>
            </Stack>

            {/* Buttons */}
            <Stack
                direction="row"
                justifyContent="space-between"
                mt={3}
                width="100%"
            >
                <PrimaryButton>Cancel</PrimaryButton>
                <PrimaryButton>Next</PrimaryButton>
            </Stack>
        </Stack>
    );
}

export default EventBasicInfo;
