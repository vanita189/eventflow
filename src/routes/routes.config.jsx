import Login from "../pages/Login";
import Signup from "../pages/Signup";
import DashboardLayout from "../pages/DashboardLayout";
import Dashboard from "../subpages/Dashboard/Dashboard";
import Event from "../subpages/events/Event";
import Ticket from "../subpages/Tickets/Ticket";
import Report from "../subpages/report/Report";
import User from "../subpages/users/User";
import CreateEvents from "../pages/createevents/CreateEvents";
import EventDetails from "../subpages/events/EventDetails";
import EditEvent from "../pages/createevents/EditEvent";
import CreateTicket from "../pages/createtickets/CreateTicket";
import TicketList from "../pages/createtickets/TicketList";
import TicketRedemption from "../pages/reedemption/TicketRedemption";
import ForgotPassword from "../pages/ForgotPassword";

export const publicRoutes = [
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "forgot-password",
        element: <ForgotPassword />
    }
];

export const privateRoutes = [
    {
        path: "/dashboardlayout",
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "events",
                element: <Event />
            },
            {
                path: "events/create",
                element: <CreateEvents />,
            },
            {
                path: "ticket",
                element: <TicketList />
            },
            {
                path: "user",
                element: <User />
            },
            {
                path: "report",
                element: <Report />
            },
            {
                path:"events/view/:id",
                element:<EventDetails/>
            },
            {
                path:"events/edit/:id",
                element:<EditEvent/>
            },
            {
                path:"ticket/create",
                element:<CreateTicket/>
            },
            {
                path:"redeem",
                element:<TicketRedemption/>
            }
        ]
    },
   

];