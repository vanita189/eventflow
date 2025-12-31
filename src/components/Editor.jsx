import { Box, Typography, TextField } from "@mui/material";

function Editor({
  label = "Description",
  value,
  onChange,
  disabled = false,
  minRows = 5,
}) {
  return (
    <Box>
      {/* {label && (
        <Typography mb={1} fontWeight={500}>
          {label}
        </Typography>
      )} */}

      <TextField
        multiline
        fullWidth
        minRows={minRows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Enter description..."
      />
    </Box>
  );
}

export default Editor;
