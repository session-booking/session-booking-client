import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import CalendarManagement from "./components/calendar/CalendarManagement";
import Login from "./components/auth/Login";
import {Provider} from "react-redux";
import store from "./redux/state/store";
import ProtectedRoute from "./redux/ProtectedRoute";
import PublicRoute from "./redux/PublicRoute";
import SessionBooking from "./components/booking/SessionBooking";
import BookingRoute from "./redux/BookingRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute component={CalendarManagement}/>,
    },
    {
        path: "/login",
        element: <PublicRoute component={Login}/>,
    },
    {
        path: "/book/:id",
        element: <BookingRoute component={SessionBooking}/>,
    }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>
);