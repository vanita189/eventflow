import { Paper, Stack, Typography, Box, Tab, Tabs, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Editor from "../../components/Editor"
import { useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";

const ENTRY_TYPES = [
    "Free Entry",
    "Cover Entry",
    "Ladies Entry",
    "Stag Entry",
    "Couple Entry"
]

function EventPackage({ packageDetails, setPackageDetails }) {
    const [entryType, setEntryType] = useState(0);
    const isFreeEntry = entryType === 0;

    const [form, setForm] = useState({
        packageName: ENTRY_TYPES[0],
        price: "",
        allowedPersons: "",
        quantity: "",
        description: ""
    })

    const [errors, setErrors] = useState({})

    handleChange = (field) => (e) => {
        setForm({ ...form, field: e.target.value })
    }

    const validatePackage = () => {
        const newErrors = {}

        if (!form.packageName) newErrors.packageName = "Package name is required"

        if (!isFreeEntry && !form.price) {
            newErrors.price = "Price is required"
        }

        if (!form.allowedPersons) {
            newErrors.allowedPersons = "Allowed persons required"
        }

        if (!form.quantity) {
            newErrors.quantity = "Quantity is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    return (
        <Stack spacing={4}>
            <Box>
                <Typography fontWeight={600}>Entry Type</Typography>
                <Tabs value={entryType}
                    onChange={(e, val) => setEntryType(val)}
                    variant="fullWidth"
                    sx={{ borderBottom: "1px solid #ccc" }}
                >
                    {
                        ENTRY_TYPES.map((type) => (
                            <Tab key={type} label={type} sx={{ fontWeight: 600 }} />
                        ))
                    }
                </Tabs>
            </Box>

            {/**Package form */}
            <Paper sx={{
                p: "24px 32px",
                border: "0.5px solid #cfcbcbff",
                borderRadius: 2
            }}>
                <Stack spacing={4}>
                    <Stack direction="row" spacing={4}>
                        <Box flex={1}>
                            <Typography fontWeight={600}>Package Name</Typography>
                            <TextField
                                fullWidth
                                error={!!errors.packageName}
                                helperText={errors.packageName}
                                value={ENTRY_TYPES[entryType]} />
                        </Box>

                        <Box flex={1}>
                            <Typography fontWeight={600}>Price (₹)</Typography>
                            <TextField
                                fullWidth
                                type="number"
                                value={form.price}
                                onChange={handleChange("price")}
                                error={!!errors.price}
                                helperText={errors.price}
                                disabled={isFreeEntry}
                                placeholder={isFreeEntry ? "Free Entry" : "Enter Amount"}
                            />
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={4}>
                        <Box flex={1}>
                            <Typography fontWeight={600}>Allowed Persons</Typography>
                            <TextField
                                fullWidth
                                type="number"
                                placeholder="Eg:1/2"
                                value={form.allowedPersons}
                                onChange={handleChange("allowedPersons")}
                                error={!!errors.allowedPersons}
                                helperText={errors.allowedPersons}
                            />

                        </Box>
                        <Box flex={1}>
                            <Typography fontWeight={600}>Total Quantity</Typography>
                            <TextField
                                fullWidth
                                type="number"
                                placeholder="Eg:100"
                            />
                        </Box>
                    </Stack>

                    <Stack>
                        <Box>
                            <Typography fontWeight={600}>Description</Typography>
                            <Editor />
                        </Box>
                    </Stack>
                </Stack>
            </Paper>
            <Stack direction="row" justifyContent="space-between">
                <PrimaryButton
                    onClick={() => {
                        if (!validatePackage()) return;

                        setPackageDetails(prev => [...prev, {
                            ...form,
                            entryType: ENTRY_TYPES[entryType]
                        }]);

                        alert("Package Added Successfully");
                    }}
                    sx={{ padding: "12px 50px" }}>
                    Previous
                </PrimaryButton>
                <PrimaryButton sx={{ padding: "12px 50px" }}>
                    Add Entry Package
                </PrimaryButton>
            </Stack>

        </Stack>
    )
}

export default EventPackage;