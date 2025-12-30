

import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useState, useRef } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


function EventImageUpload() {
    const [image, setImage] = useState(null);
    const inputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setImage(null);
    };

    return (
        <Box
            onClick={() => inputRef.current.click()}
            sx={{
                width: "100%",
                border: "1.5px dashed #ccc",
                borderRadius: 2,
                height:"260px",              // padding:"10px 0px",

                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",             // ✅ critical
                "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "#fafafa",
                },
            }}
        >
            {image ? (
                <>
                    <Box
                        component="img"
                        src={image}
                        alt="event"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 2,
                        }}
                    />

                    {/* Remove icon */}
                    <IconButton
                        size="small"
                        onClick={handleRemoveImage}
                        sx={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.8)",
                            },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </>
            ) : (
                <Box textAlign="center">
                    <AddPhotoAlternateIcon color="action" sx={{ fontSize: 36 }} />
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        Upload event banner
                    </Typography>
                </Box>
            )}

            <input
                ref={inputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
        </Box>
    );
}

export default EventImageUpload;
