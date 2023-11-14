import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInAction } from "../redux/actions/auth.actions";

const AuthCallback = () => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
  
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setLoadingText("Signing in...");
        const timeout = setTimeout(() => {
          setLoadingText(
            "This is taking longer than usual. Please wait while backend services are getting started."
          );
        }, 5000);
        const urlParams = new URLSearchParams(window.location.search)
        const dispatchAsync = async () => {
            await dispatch(signInAction(urlParams, navigate));
        }
        dispatchAsync();

        setLoading(false);
        clearTimeout(timeout);
    }, []);
  
    const signInError = useSelector((state: any) => state.auth?.signInError);
    const successMessage = useSelector((state: any) => state.auth?.successMessage);
  
    const handleClearMessage = () => {
      // dispatch(clearMessage());
    };
  
    return (
      <section className="bg-white">
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-6">
            {signInError && (
              <div>"Error"</div>
            )}
            {successMessage && (
              <div>Success</div>
            )}
            <div className="mt-6 flex items-center justify-center">
              <Link
                to={"/signin"}
                className="w-1/3 border-b-2 border-blue-500 pb-4 text-center font-medium text-gray-800 "
              >
                Sign In
              </Link>
              <Link
                to={"/signup"}
                className="w-1/3 border-b border-gray-400 pb-4 text-center font-medium text-gray-500 "
              >
                Sign Up
              </Link>
            </div>
        </div>
      </section>
    );
  };
  
  export default AuthCallback;