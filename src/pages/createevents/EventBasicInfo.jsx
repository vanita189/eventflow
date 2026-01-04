import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import EventImageUpload from "../../components/EventImageUpload"
import { Box } from "@mui/material"
import EventLocationPicker from "../../components/EventLocationPicker"
import Editor from "../../components/Editor"
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PrimaryButton from '../../components/PrimaryButton';

function EventBasicInfo({ eventDetails, setEventDetails, validateBasicInfo, setStep }) {
    return (
        <Stack spacing={4} >
            <Stack direction="row" justifyContent="space-evenly" gap={5}>
                <Stack spacing={3} flex={1} mb={2}>
                    <Box>
                        <Typography fontWeight={600} >Event Name</Typography>
                        <TextField
                            value={eventDetails.eventName}
                            onChange={(e) => (
                                setEventDetails({ ...eventDetails, eventName: e.target.value })
                            )}
                            placeholder="Enter Event Name"
                            fullWidth

                        />
                    </Box>
                    <Box height={280}>
                        <Typography fontWeight={600} >Event Image</Typography>
                        <EventImageUpload
                            value={eventDetails.eventImage}
                            onChange={(image) => {
                                setEventDetails({ ...eventDetails, eventImage: image })
                            }}
                        />
                    </Box>
                </Stack>
                <Stack flex={1}>
                    <Box>
                        <Typography fontWeight={600} >Event Location</Typography>

                        <EventLocationPicker
                            value={eventDetails.eventLocation}
                            onChange={(location) => (
                                setEventDetails({ ...eventDetails, eventLocation: location })
                            )}
                        />
                    </Box>
                </Stack>
            </Stack>
            <Stack gap={5} justifyContent="space-evenly" direction="row" width="100%">

                <Box flex={1}>
                    <Typography fontWeight={600} >Event Start Date</Typography>
                    <DateTimePicker
                        value={eventDetails.eventStartDate}
                        onChange={(newValue) => setEventDetails({
                            ...eventDetails, eventStartDate: newValue
                        })}
                        disablePast
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!buildErrorMessage.eventStartDate,
                                helperText: errors.eventStartDate
                            },
                        }}
                    />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={600} >Event End Date</Typography>
                    <DateTimePicker
                        value={eventDetails.eventEndDate}
                        onChange={(newValue) => setEventDetails({
                            ...eventDetails, eventEndDate: newValue
                        })}
                        disablePast
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.eventEndDate,
                                helperText: errors.eventEndDate
                            },
                        }}
                    />
                </Box>
            </Stack>

            <Stack spacing={3} justifyContent="space-evenly" direction="row">

                <Box flex={1}>
                    <Typography fontWeight={600} >Ticket Distribution Start Date</Typography>
                    <DateTimePicker
                        value={eventDetails.ticketStartDate}
                        onChange={(newValue) => setEventDetails({
                            ...eventDetails, ticketStartDate: newValue
                        })}
                        disablePast
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.ticketStartDate,
                                helperText: errors.ticketStartDate

                            },
                        }}
                    />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={600} >Ticket Distribution End Date</Typography>
                    <DateTimePicker
                        value={eventDetails.ticketEndDate}
                        onChange={(newValue) => setEventDetails({
                            ...eventDetails, ticketEndDate: newValue
                        })}
                        disablePast
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.ticketEndDate,
                                helperText: errors.ticketEndDate

                            },
                        }}
                    />
                </Box>
            </Stack>

            <Stack spacing={3} justifyContent="space-evenly" direction="row">

                <Box flex={1}>
                    <Typography fontWeight={600} >Event Capacity</Typography>
                    <TextField
                        type="number"
                        value={eventDetails.eventCapacity}
                        onChange={(e) => setEventDetails({
                            ...eventDetails, eventCapacity: e.target.value
                        })}
                        placeholder="Enter Event Name"
                        fullWidth

                    />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={600} >Event Tags</Typography>
                    <TextField
                        value={eventDetails.eventTags}
                        onChange={(e) => setEventDetails({ ...eventDetails, eventTags: e.target.value })}
                        placeholder="Enter Event Name"
                        fullWidth
                    />
                </Box>
            </Stack>

            <Stack spacing={3} flex={1}>


                <Box>
                    <Typography fontWeight={600} >Event Description</Typography>
                    <Editor
                        value={eventDetails.eventDescription}
                        onChange={(value) => setEventDetails({
                            ...eventDetails, eventDescription: value
                        })}
                    />
                </Box>
            </Stack>
            <Stack justifyContent="space-between" flexDirection="row">
                <PrimaryButton sx={{ padding: "12px 50px" }}>
                    Cancel
                </PrimaryButton>
                <PrimaryButton sx={{ padding: "12px 50px" }}
                    onClick={() => {
                        if (validateBasicInfo()) {
                            setStep(1)
                        }
                    }}>
                    Next
                </PrimaryButton>
            </Stack>

        </Stack>
    )
}

export default EventBasicInfo