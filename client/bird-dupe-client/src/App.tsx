import { useState, useEffect, lazy, Suspense } from "react";
import { Provider, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import createAppStore from "./redux/store";
import CommonLoading from "./components/loader/CommonLoading";
import ErrorComponent from "./components/error/CommonError";
import axios from "axios";

import { publicRoutes, privateRoutes } from "./routes";
import Landing from "./pages/landing";
import Home from "./pages/home";



function App() {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStore = async () => {
      try {
        const appStore = await createAppStore();
        setStore(appStore);
      } catch (err: any) {
        setError(`Error initializing the app: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeStore();
  }, []);

  if (loading || error) {
    return (
      <div className="flex items-center justify-center h-screen">
        {loading ? <CommonLoading /> : <ErrorComponent errorMessage={error} />}
      </div>
    );
  }

  const userData = useSelector((state: any) => state.auth?.userData);

  return (
    <>
      <Provider store={store}>
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
              path="/signin"
              element={userData ? <Navigate to="/" /> : <Landing />}
            />
            <Route
              path="/"
              element={userData ? <Home /> : <Landing />}
            />
          </Routes>
        </Suspense>
      </Provider>
    </>
  )
}

export default App
