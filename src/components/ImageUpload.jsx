import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useRef } from "react";
import Box from "@mui/material/Box";
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

function ImageUpload({ value, onChange }) {
    const inputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        //basic validation
        if (!file.type.startsWith("image/")) {
            alert("only image files are allowed");
            return;

        }
        onChange(file);
    }
    return (
        <Box
            border="2px dashed #ccc"
            borderRadius={2}
            p={2}
            textAlign="center"
            position="relative"
        >
            {
                value ? (
                    <>

                        <img
                            src={URL.createObjectURL(value)}
                            alt="event"
                            style={{ width: "100%", height: 180, objectFit: "cover" }}
                        />
                        <IconButton
                            size="small"
                            onClick={() => onChange(null)}
                            sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </>
                ) : (
                    <Box onClick={() => inputRef.current.click()} sx={{cursor:"pointer"}}
                    >
                        <AddPhotoAlternateIcon fontSize="large" />
                        <Typography fontWeight={500}>
                            Click to upload image
                        </Typography>
                        <input
                            type="file"
                            hidden
                            ref={inputRef}
                            onChange={handleFileChange}
                            accept="image/*"

                        />
                        <Box
                            sx={{ cursor: "pointer" }}
                        >
                            <Typography color="Primary">Upload</Typography>
                        </Box>

                    </Box>
                )
            }

        </Box>
    )
}

export default ImageUpload