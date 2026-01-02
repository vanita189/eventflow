import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import EventImageUpload from "../../components/EventImageUpload"
import { Box } from "@mui/material"
import EventLocationPicker from "../../components/EventLocationPicker"
import Editor from "../../components/Editor"
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PrimaryButton from '../../components/PrimaryButton';

function EventBasicInfo() {
    return (
        <Stack spacing={4} >
            <Stack direction="row" justifyContent="space-evenly" gap={5}>
                <Stack spacing={3} flex={1} mb={2}>
                    <Box>
                        <Typography fontWeight={600} >Event Name</Typography>
                        <TextField placeholder="Enter Event Name" fullWidth required />
                    </Box>
                    <Box height={280}>
                        <Typography fontWeight={600} >Event Image</Typography>
                        <EventImageUpload />
                    </Box>
                </Stack>
                <Stack flex={1}>
                    <Box>
                        <Typography fontWeight={600} >Event Location</Typography>

                        <EventLocationPicker />
                    </Box>
                </Stack>
            </Stack>
            <Stack gap={5} justifyContent="space-evenly" direction="row" width="100%">

                <Box flex={1}>
                    <Typography fontWeight={600} >Event Start Date</Typography>
                    <DateTimePicker
                        disablePast

                        slotProps={{
                            textField: {
                                fullWidth: true,
                            },
                        }}
                    />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={600} >Event End Date</Typography>
                    <DateTimePicker
                        disablePast

                        slotProps={{
                            textField: {
                                fullWidth: true,
                            },
                        }}
                    />
                </Box>
            </Stack>

            <Stack spacing={3} justifyContent="space-evenly" direction="row">

                <Box flex={1}>
                    <Typography fontWeight={600} >Ticket Distribution Start Date</Typography>
                    <DateTimePicker
                        disablePast

                        slotProps={{
                            textField: {
                                fullWidth: true,
                            },
                        }}
                    />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={600} >Ticket Distribution End Date</Typography>
                    <DateTimePicker
                        disablePast

                        slotProps={{
                            textField: {
                                fullWidth: true,
                            },
                        }}
                    />
                </Box>
            </Stack>

            <Stack spacing={3} justifyContent="space-evenly" direction="row">

                <Box flex={1}>
                    <Typography fontWeight={600} >Event Capacity</Typography>
                    <TextField placeholder="Enter Event Name" fullWidth required />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={600} >Event Tags</Typography>
                    <TextField placeholder="Enter Event Name" fullWidth required />
                </Box>
            </Stack>

            <Stack spacing={3} flex={1}>


                <Box>
                    <Typography fontWeight={600} >Event Description</Typography>
                    <Editor />
                </Box>
            </Stack>
            <Stack justifyContent="space-between" flexDirection="row">
                <PrimaryButton sx={{padding:"12px 50px"}}>
                        Cancel
                </PrimaryButton>
                <PrimaryButton sx={{padding:"12px 50px"}}>
                        Next
                </PrimaryButton>
            </Stack>

        </Stack>
    )
}

export default EventBasicInfo