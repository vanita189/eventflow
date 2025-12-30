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
import Doughnut from "../../components/Doughnut";


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

const sampleData = [
    { id: 'A', value: 40, label: 'A' },
    { id: 'B', value: 30, label: ' B' },
    { id: 'C', value: 20, label: ' C' },
];

function Piechart() {
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
    const chartSize = isMobile ? 150 : 200;

    return (
        <Box display="flex" flexDirection="column" mt={5}>
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
            <Box
                mt={2}
                sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: { xs: "auto", md: "auto", lg: "visible" },
                    flexWrap: { xs: "nowrap", md: "nowrap", lg: "wrap" },
                    scrollSnapType: { xs: "x mandatory", md: "x mandatory", lg: "none" },
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                {[1, 2, 3, 4].map((_, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            flex: "0 0 auto",
                            scrollSnapAlign: "start",
                            width: {
                                xs: "55%",      // mobile → 1 chart
                                md: "50%",       // tablet → 2 charts
                                lg: "auto",      // desktop → natural width
                            },
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Doughnut
                            key={idx}
                            data={sampleData}
                            width={chartSize}
                            height={chartSize}
                            innerRadius={chartSize / 3}   // adjust inner radius
                            outerRadius={chartSize / 2}   // adjust outer radius
                            settings={{ colors: ['#8338EC', '#FF006E', '#FB5607'] }}
                        />
                    </Box>
                ))}
            </Box>

        </Box>
    )
}

export default Piechart;