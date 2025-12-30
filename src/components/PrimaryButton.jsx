import Button from "@mui/material/Button";

function PrimaryButton({
  children,
  startIcon,
  onClick,
  sx = {},
  ...props
}) {
  return (
    <Button
      variant="contained"
      startIcon={startIcon}
      onClick={onClick}
      disableElevation
      sx={{
        backgroundColor: "#5e02feff",
        color: "#fff",
        textTransform: "none",
        borderRadius: "8px",
        padding: "8px 16px",
        border: "none",

        "&:hover": {
          backgroundColor: "primary.dark",
        },

        "&:focus": {
          outline: "none",
        },

        ...sx, // allow override if needed
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

export default PrimaryButton;
