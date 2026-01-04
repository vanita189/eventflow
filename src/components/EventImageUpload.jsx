

import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useState, useRef } from "react";



function EventImageUpload({ onChange, value }) {
    // const [image, setImage] = useState(null);
    const inputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onChange(file); // send file to parent
        }
    };



    const handleRemoveImage = (e) => {
        e.stopPropagation();
        onChange?.(null); // ✅ clear in parent
    };

    return (
        <Box
            onClick={() => inputRef.current.click()}
            sx={{
                width: "100%",
                height: "100%",
                border: "1.5px dashed #ccc",
                borderRadius: 2,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {value ? (
                <>
                    {/* <Box
                        component="img"
                        src={image}
                        alt="event"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",   // ✅ FULL image visible
                            borderRadius: 2,
                        }}
                    /> */}
                    <img
                        src={URL.createObjectURL(value)}
                        alt="event"
                        style={{  width: "100%",
                            height: "100%",
                            objectFit: "contain",   // ✅ FULL image visible
                            borderRadius: 2, }}
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
