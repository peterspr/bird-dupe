import CommonLoading from "./components/loader/CommonLoading";
import ErrorComponent from "./components/error/CommonError";

import createAppStore from "./redux/store";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import App from './App';

const AppContainer = () => {
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
  
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  };
  
  export default AppContainer;