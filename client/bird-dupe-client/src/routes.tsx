import { lazy, ReactElement } from "react";
import Landing from "./pages/landing";

interface RouteItem {
  path: string;
  element: ReactElement;
}

export const privateRoutes: RouteItem[] = [];
export const publicRoutes: RouteItem[] = [
    {
        path: "/signin",
        element: <Landing />,
    },
    // {
    //     path: "/auth/signup",
    //     element: <SignUp />,
    // },
];