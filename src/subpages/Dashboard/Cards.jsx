import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";


const cards = [
    {
        id: 1,
        count: '250',
        description: 'Total Coupons.',
    },
    {
        id: 2,
        count: '120',
        description: 'coupons avaialable',
    },
    {
        id: 3,
        count: '1400',
        description: 'total coupon sales',
    },
    {
        id: 4,
        count: '8000',
        description: 'non redeemed amount',
    },
];

function Cards() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCard, setSelectedCard] = useState(0);

    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    };
    const handleClose = () => {
        setAnchorEl(null)
    }
    return (
        <Box display="flex" flexDirection="column" >
            <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Current Events</Typography>
                <Button onClick={handleClick}>Event Name </Button>
                <Menu anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}>
                    <MenuItem onClick={handleClose}>first event</MenuItem>
                    <MenuItem onClick={handleClose}>second</MenuItem>
                    <MenuItem onClick={handleClose}>third</MenuItem>
                </Menu>

            </Box>
            <Box display="flex" gap={2} flexWrap="wrap" justifyContent="space-between" mt={1}>
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        sx={{
                            width: {
                                xs: 155,   // mobile → SAME size for all cards
                                sm: 160,
                                md: 300,
                            },
                            height: {
                                xs: 110,   // mobile → SAME height
                                sm: 110,
                                md: 140,
                            },
                            borderRadius: 3,
                            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                        }}
                    >
                        <CardActionArea sx={{ height: "100%" }}>
                            <CardContent
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontSize: {
                                            xs: "1.25rem", // mobile
                                            sm: "1.5rem",  // small screens
                                            lg: "2.125rem" // desktop (h4 default)
                                        },
                                        fontWeight: 700,
                                        color: "#6C63FF",
                                    }}
                                >
                                    {card.count}
                                </Typography>

                                <Typography variant="h5" color="text.secondary" sx={{
                                    fontWeight: 700,
                                    fontSize: {
                                        xs: "0.8rem", // mobile
                                        sm: "0.8rem",  // small screens
                                        lg: "1.5rem" // desktop (h4 default)
                                    },
                                    // color: "#6C63FF",
                                }}>
                                    {card.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>

        </Box>
    )
}

export default Cards