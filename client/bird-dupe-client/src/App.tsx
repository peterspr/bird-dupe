
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

import { publicRoutes } from "./routes"; // need to add privateRoutes later
import Landing from "./pages/landing";
import Home from "./pages/home";
import CommonLoading from "./components/loader/CommonLoading";



function App() {
  const userData = useSelector((state: any) => state.auth?.userData);

  return (
    <Suspense fallback={<CommonLoading />}>
      <Routes>
        {/* <Route element={<PrivateRoute userData={userData} />}>
          {privateRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route> */}

        {publicRoutes.map((route: any) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route
          path="/"
          element={userData ? <Home /> : <Landing />}
        />
      </Routes>
    </Suspense>
  )
}

export default App
