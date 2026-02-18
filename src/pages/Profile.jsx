import { useEffect, useState, useContext } from "react";
import { supabase } from "../config/supabase";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  Grid,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (error) throw error;
        setProfile(data);
        setFormData(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          customer_name: formData.customer_name,
          email: formData.email,
          mobile_number: formData.mobile_number,
          role: formData.role,
          pub_name: formData.pub_name,
        })
        .eq("id", user.id);
      if (error) throw error;
      setProfile(formData);
      setEditing(false);
    } catch (err) {
      console.error(err.message);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 15 }}>
        <CircularProgress size={70} />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Typography variant="h5" textAlign="center" mt={15}>
        No profile data found.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#f5f6fa", py: 8, px: { xs: 2, md: 6 } }}>
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        {/* Left Panel: Profile Summary */}
        <Box
          sx={{
            flex: "0 0 320px",
            backgroundColor: "#ffffff",
            borderRight: { md: "1px solid #e0e0e0" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 5,
            gap: 2,
          }}
        >
          <Avatar
            src={profile.profile_photo || ""}
            alt={profile.customer_name}
            sx={{ width: 140, height: 140, mb: 2 }}
          />
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            {profile.customer_name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {profile.role}
          </Typography>
          {!editing && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditing(true)}
              sx={{ mt: 3, width: "100%" }}
            >
              Edit Profile
            </Button>
          )}

          {/* Optional Stats */}
          <Stack direction="row" spacing={2} mt={4} width="100%" justifyContent="space-around">
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                12
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Events
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                3
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tickets
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Right Panel: Editable Info */}
        <Box sx={{ flex: 1, p: { xs: 4, md: 6 }, backgroundColor: "#f9fafb" }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Profile Details
          </Typography>

          <Grid container spacing={4}>
            {[
              { label: "Email", key: "email" },
              { label: "Mobile Number", key: "mobile_number" },
              { label: "Pub Name", key: "pub_name" },
              { label: "Company ID", key: "company_id" },
              { label: "Created At", key: "created_at", format: true },
            ].map((field) => (
              <Grid item xs={12} md={6} key={field.key}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    transition: "all 0.3s",
                    "&:hover": { transform: "scale(1.03)", boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" },
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {field.label}
                  </Typography>
                  {editing && field.key !== "created_at" ? (
                    <TextField
                      fullWidth
                      size="small"
                      name={field.key}
                      value={formData[field.key]}
                      onChange={handleChange}
                      sx={{ mt: 1 }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {field.format
                        ? new Date(profile[field.key]).toLocaleString()
                        : profile[field.key]}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Save / Cancel Buttons */}
          {editing && (
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={5}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#388e3c" },
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                }}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
