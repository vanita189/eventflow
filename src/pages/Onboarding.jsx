import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Grid,
  MenuItem,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const steps = [
  "Personal Info",
  "Business Info",
  "Profile Photo",
  "Review",
];

function Onboarding() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    mobile_number: "",
    role: "",
    pub_name: "",
    profile_photo: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleNext = async () => {
  // If not last step → just move forward
  if (activeStep < steps.length - 1) {
    setActiveStep((prev) => prev + 1);
    return;
  }

  // LAST STEP → submit everything
  if (!user) return;

  setLoading(true);

  try {
    // 1️⃣ Create company
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: formData.pub_name,
      })
      .select()
      .single();

    if (companyError) throw companyError;

    // 2️⃣ Upload profile photo (optional)
    let photoUrl = null;

    if (formData.profile_photo) {
      const fileExt = formData.profile_photo.name.split(".").pop();
      const filePath = `${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, formData.profile_photo, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      photoUrl = data.publicUrl;
    }

    // 3️⃣ Insert profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        customer_name: formData.customer_name,
        email: formData.email,
        mobile_number: formData.mobile_number,
        role: formData.role,
        pub_name: formData.pub_name,
        profile_photo: photoUrl,
        company_id: company.id,
      });

    if (profileError) throw profileError;

    navigate("/dashboardlayout");

  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
};


  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <MenuItem value="Owner">Owner</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Staff">Staff</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <TextField
            fullWidth
            label="Pub Name"
            name="pub_name"
            value={formData.pub_name}
            onChange={handleChange}
            required
          />
        );

      case 2:
        return (
          <Stack spacing={3} alignItems="center">
            <Avatar
              src={preview}
              sx={{ width: 120, height: 120 }}
            />
            <Button variant="contained" component="label">
              Upload Profile Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
          </Stack>
        );

      case 3:
        return (
          <Box>
            <Typography><strong>Name:</strong> {formData.customer_name}</Typography>
            <Typography><strong>Email:</strong> {formData.email}</Typography>
            <Typography><strong>Mobile:</strong> {formData.mobile_number}</Typography>
            <Typography><strong>Role:</strong> {formData.role}</Typography>
            <Typography><strong>Pub:</strong> {formData.pub_name}</Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: 750,
          p: 6,
          borderRadius: 5,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Complete Your Profile ✨
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          mb={4}
        >
          Let’s get your EventsFlow workspace ready
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        <Stack direction="row" justifyContent="space-between" mt={5}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>

          <Button
            onClick={handleNext}
            variant="contained"
            disabled={loading}
            sx={{
              px: 4,
              background: "linear-gradient(90deg, #4f46e5, #9333ea)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              "Finish Setup"
            ) : (
              "Next"
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Onboarding;
