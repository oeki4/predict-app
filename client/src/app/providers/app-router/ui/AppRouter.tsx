import { createBrowserRouter, RouterProvider } from "react-router";
import { routeConfig } from "@shared/config/routes/routeConfig";

const router = createBrowserRouter(routeConfig);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
