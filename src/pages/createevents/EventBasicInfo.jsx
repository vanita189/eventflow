import { useState } from "react";
import { Stack, TextField, Typography, Box } from "@mui/material";
import PrimaryButton from "../../components/PrimaryButton";
import EventImageUpload from "../../components/EventImageUpload";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import EventLocationPicker from "../../components/EventLocationPicker";
import Editor from "../../components/Editor"

function EventBasicInfo({ values, setValues, errors, onNext }) {


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
                            value={values.eventName}
                            onChange={(e) =>
                                setValues({ ...values, eventName: e.target.value })
                            }
                            error={!!errors.eventName}
                        />
                    </Stack>

                    {/* Upload Image */}
                    <Stack spacing={1} width="100%">
                        <Typography fontWeight={700}>Upload Image</Typography>
                        <Box>
                            <EventImageUpload
                                error={errors.image}
                                onChange={(img) => setValues({ ...values, image: img })}
                            />
                            {errors.image && (
                                <Typography color="error">{errors.image}</Typography>
                            )}
                        </Box>
                    </Stack>
                </Stack>

                {/* Event Location */}
                <Stack spacing={1} flex={1} minWidth={0}>
                    <Typography fontWeight={700}>Event Location</Typography>
                    {/* <EventLocationPicker
                        onLocationSelect={(loc) =>
                            setValues({ ...values, location: loc })
                        }
                    />
                    {errors.location && (
                        <Typography color="error">{errors.location}</Typography>
                    )} */}
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
                            value={values.startDate}
                            onChange={(val) =>
                                setValues({ ...values, startDate: val })
                            }
                            renderInput={(props) => <TextField {...props} fullWidth />}
                        />
                    </Stack>

                    <Stack spacing={1} flex={1} minWidth={0}>
                        <Typography fontWeight={700}>End Date & Time</Typography>
                        <DateTimePicker
                            value={values.endDate}
                            onChange={(val) =>
                                setValues({ ...values, endDate: val })
                            }
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
                        value={values.capacity}
                        onChange={(e) =>
                            setValues({ ...values, capacity: e.target.value })
                        }
                        error={!!errors.capacity}
                    />
                </Stack>

                <Stack spacing={1} flex={1} minWidth={0}>
                    <Typography fontWeight={700}>Event Tags (comma separated)</Typography>
                    <TextField
                        name="tags"
                        fullWidth
                        value={values.tags}
                        onChange={(e) =>
                            setValues({ ...values, tags: e.target.value })
                        }
                    />
                </Stack>
            </Stack>
            <Stack>
                <Editor
                    value={values.description}
                    onChange={(val) =>
                        setValues({ ...values, description: val })
                    }
                />
            </Stack>

            {/* Buttons */}
            <Stack
                direction="row"
                justifyContent="space-between"
                mt={3}
                width="100%"
            >
                <PrimaryButton>Cancel</PrimaryButton>
                <PrimaryButton  onClick={onNext} > Next</PrimaryButton>
            </Stack>
        </Stack>
    );
}

export default EventBasicInfo;
