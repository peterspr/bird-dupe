import { ReactElement } from "react";
import Landing from "./pages/landing";
import TokenRedirect from "./pages/tokenRedirect";

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
    {
      path: "/token",
      element: <TokenRedirect />,
    },
    // {
    //     path: "/auth/signup",
    //     element: <SignUp />,
    // },
];