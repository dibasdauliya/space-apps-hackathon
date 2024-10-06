import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./route/home";
import CameraTest from "./route/cameraTest";
import CarView from "./route/car-view";
import Soldier from "./route/soldier";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/camera-test",
    element: <CameraTest />,
  },
  {
    path: "/car-view",
    element: <CarView />,
  },
  {
    path: "/soldier",
    element: <Soldier />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
