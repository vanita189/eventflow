import { Box } from "@mui/material";
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PrimaryButton from "../../components/PrimaryButton";
import { useState, useEffect } from "react";
import ImageUpload from "../../components/ImageUpload";
import Location from "../../components/Location";

function EditEventBasicInfo({
    eventDetails,
    setEventDetails,
    validateBasicInfo
}) {

    // useEffect(() => {
    //   console.log("EVENT DETAILS STATE 1234👉", eventDetails);
    // }, [eventDetails]);

    return (
        <Stack spacing={2} mt={1}>
            <Stack display="flex" flexDirection={"row"} gap={2}>
                <Stack flex={1} spacing={2}>
                    <Box>
                        <Typography fontWeight={600}>Event Name</Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter the event name here"
                            value={eventDetails.eventName}
                            onChange={(e) =>
                                setEventDetails(prev => ({
                                    ...prev,
                                    eventName: e.target.value,
                                }))
                            }
                        />
                    </Box>
                    <Box>
                        <Typography fontWeight={600}>Event Image</Typography>
                        <ImageUpload
                            // value={eventDetails.eventImage}
                            // onChange={(file)=>
                            //     setEventDetails(prev=>({
                            //         ...prev,
                            //         eventImage:file
                            //     }))}
                            width={"100%"}
                            height={280}
                        />
                    </Box>
                </Stack>
                <Stack flex={1}>
                    <Typography fontWeight={600}>Event Location</Typography>
                    <Location
                    // value={location}
                    // onChange={setLocation}
                    />
                </Stack>
            </Stack>

            <Stack display={"flex"} flexDirection={"row"} gap={2}>
                <Box flex={1}>
                    <Typography fontWeight={600}>Event Start Date</Typography>
                    <DateTimePicker
                        slotProps={{
                            textField: {
                                fullWidth: true
                            }
                        }}
                    />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={600}>Event End Date</Typography>
                    <DateTimePicker
                        slotProps={{
                            textField: {
                                fullWidth: true
                            }
                        }}
                    />
                </Box>
            </Stack>

            <Stack display={"flex"} flexDirection={"row"} gap={2}>
                <Box flex={1}>
                    <Typography fontWeight={600}>Ticket Distribution Start</Typography>
                    <DateTimePicker
                        slotProps={{
                            textField: {
                                fullWidth: true
                            }
                        }}
                    />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={600}>Ticket Distribution End</Typography>
                    <DateTimePicker
                        slotProps={{
                            textField: {
                                fullWidth: true
                            }
                        }}
                    />
                </Box>
            </Stack>

            <Stack display={"flex"} flexDirection={"row"} gap={2}>
                <Box flex={1}>
                    <Typography fontWeight={600}>Event Capacity</Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter the capacity here"
                    />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={600}>Event Tags</Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter the tags here"
                    />
                </Box>
            </Stack>
            <Stack>
                <Typography fontWeight={600}>Event Description</Typography>
                <TextField
                    multiline
                    minRows={4}
                    placeholder="Enter Event Description"
                    fullWidth
                />
            </Stack>
            <Stack>
                <Box justifyContent="space-between" display={"flex"}>
                    <PrimaryButton>Cancel</PrimaryButton>
                    <PrimaryButton>Next</PrimaryButton>
                </Box>
            </Stack>

        </Stack>
    )
}

export default EditEventBasicInfo