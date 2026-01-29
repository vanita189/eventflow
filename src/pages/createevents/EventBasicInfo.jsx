import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import EventImageUpload from "../../components/EventImageUpload"
import { Box } from "@mui/material"
import EventLocationPicker from "../../components/EventLocationPicker"
import Editor from "../../components/Editor"
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PrimaryButton from '../../components/PrimaryButton';
import { showSnackbar } from "../../redux/snackbar/snackbarSlice"
import { useDispatch } from "react-redux";
import Location from "../../components/Location";
import ImageUpload from "../../components/ImageUpload"

function EventBasicInfo({ eventDetails, setEventDetails, validateBasicInfo, setStep, errors }) {
    const dispatch = useDispatch();

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
                            sx={{
                                mt: 0.5,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    background: "#fff",
                                },
                            }}
                        />
                    </Box>
                    <Box height={280}>
                        <Typography fontWeight={600} >Event Image</Typography>

                        <ImageUpload
                            value={eventDetails.eventImage}
                            onChange={(file) => {
                                setEventDetails({ ...eventDetails, eventImage: file })
                            }} />

                    </Box>
                </Stack>
                <Stack flex={1}>
                    <Box>
                        <Typography fontWeight={600} >Event Location</Typography>


                        <Location
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
                                error: !!errors.eventStartDate,
                                helperText: errors.eventStartDate,
                                InputProps: {
                                    sx: {
                                        borderRadius: "12px",
                                        backgroundColor: "#fff",
                                    },
                                },
                            },
                        }}

                    />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={600} >Event End Date</Typography>
                    <DateTimePicker
                        value={eventDetails.eventEndDate}
                        onChange={(newValue) =>
                            setEventDetails({
                                ...eventDetails,
                                eventEndDate: newValue,
                            })
                        }
                        disablePast
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.eventEndDate,
                                helperText: errors.eventEndDate,
                                InputProps: {
                                    sx: {
                                        borderRadius: "12px",
                                        backgroundColor: "#fff",
                                    },
                                },
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
                                helperText: errors.ticketStartDate,
                                InputProps: {
                                    sx: {
                                        borderRadius: "12px",
                                        backgroundColor: "#fff",
                                    },
                                },

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
                                helperText: errors.ticketEndDate,
                                InputProps: {
                                    sx: {
                                        borderRadius: "12px",
                                        backgroundColor: "#fff",
                                    },
                                },

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
                        sx={{
                            mt: 0.5,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                background: "#fff",
                            },
                        }}
                    />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={600} >Event Tags</Typography>
                    <TextField
                        value={eventDetails.eventTags}
                        onChange={(e) => setEventDetails({ ...eventDetails, eventTags: e.target.value })}
                        placeholder="Enter Event Name"
                        fullWidth
                        sx={{
                            mt: 0.5,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                background: "#fff",
                            },
                        }}
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
                        if (!validateBasicInfo()) {
                            dispatch(
                                showSnackbar({
                                    message: "Please fill all the required fields first",
                                    severity: "warning",
                                })
                            );
                            return;
                        }

                        setStep(1);
                    }}>
                    Next
                </PrimaryButton>
            </Stack>

        </Stack>
    )
}

export default EventBasicInfo                   