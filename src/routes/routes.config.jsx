import Login from "../pages/Login";
import Signup from "../pages/Signup";
import DashboardLayout from "../pages/DashboardLayout";
import Dashboard from "../subpages/Dashboard/Dashboard";
import Event from "../subpages/events/Event";
import Ticket from "../subpages/Tickets/Ticket";
import Report from "../subpages/report/Report";
import User from "../subpages/users/user";
import CreateEvents from "../pages/createevents/CreateEvents";

export const publicRoutes = [
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/signup",
        element: <Signup />,
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
                element: <Ticket />
            },
            {
                path: "user",
                element: <User />
            },
            {
                path: "report",
                element: <Report />
            }
        ]
    },
   

];