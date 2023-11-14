import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInAction } from "../redux/actions/auth.actions";
import axios from "axios";
import React from "react";

const Landing = () => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
  
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();

    const handleSignIn = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const response = await axios.get('/auth/signin');
        const { data } = response;
        window.location.href = data.authURL;
    };

    const handleSignUp = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const response = await axios.get('/auth/signin');
        const { data } = response;
        window.location.href = data.authURL;
    };
  
    const signInError = useSelector((state: any) => state.auth?.signInError);
    const successMessage = useSelector((state: any) => state.auth?.successMessage);
  
    const handleClearMessage = () => {
      // dispatch(clearMessage());
    };
  
    return (
      <section className="bg-white">
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-6">
            <div className="mt-6 flex items-center justify-center">
              <button className="btn btn-blue" onClick={handleSignIn}>Sign In</button>
              <button className="btn btn-blue" onClick={handleSignUp}>Sign Up</button>
            </div>
        </div>
      </section>
    );
  };
  
  export default Landing;