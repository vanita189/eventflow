import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { uploadImage } from "../api/uploadImage"
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbar/snackbarSlice";

function ImageUpload({ value, onChange }) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false); // optional: show loading state
    const dispatch = useDispatch();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            dispatch(
                showSnackbar({
                    message: "Only image files are allowed",
                    severity: "error",
                })
            )
            return;
        }

        try {
            setUploading(true); // start loading

            // Upload file to Cloudinary
            const imageUrl = await uploadImage(file);

            // Pass the uploaded URL back to parent
            onChange(imageUrl);

        } catch (err) {
            console.error("Upload failed:", err.message);
            dispatch(
                showSnackbar({
                    message: err.message || "Image upload failed. Try again!",
                    severity: "error",
                })
            )
        } finally {
            setUploading(false); // end loading
        }
    };

    const handleRemove = () => {
        onChange(null);
    };

    return (
        <Box
            border="2px dashed #ccc"
            borderRadius={2}
            p={2}
            textAlign="center"
            position="relative"
            sx={{ cursor: !value ? "pointer" : "default" ,borderRadius: "12px",
                                background: "#fff", }}
            onClick={() => !value && inputRef.current.click()}
        >
            {value ? (
                <>
                    <img
                        src={value}
                        alt="event"
                        style={{ width: "100%", height: 180, objectFit: "cover", }}
                         
                    />
                    <IconButton
                        size="small"
                        onClick={handleRemove}
                        sx={{ position: "absolute", top: 8, right: 8 }}
                        aria-label="Remove image"
                    >
                        <CloseIcon />
                    </IconButton>
                </>
            ) : (
                <>
                    <AddPhotoAlternateIcon fontSize="large" />
                    <Typography fontWeight={500}>
                        {uploading ? "Uploading..." : "Click to upload image"}
                    </Typography>
                    <input
                        type="file"
                        hidden
                        ref={inputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        
                    />
                </>
            )}
        </Box>
    );
}

export default ImageUpload;
