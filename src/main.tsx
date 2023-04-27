import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import CalendarManagement from "./components/CalendarManagement";

const router = createBrowserRouter([
    {
        path: "/",
        element: <CalendarManagement/>
    }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
