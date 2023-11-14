import * as types from "../constants/auth.constants";
import { isValidToken } from "../../utils/auth.utils";
const baseURL = 'http://localhost:3000';

export const initializeAuth = () => async (dispatch: (arg0: any) => void) => {
    const accessToken = JSON.parse(localStorage.getItem("profile") ?? '')?.accessToken;
    const refreshToken = JSON.parse(localStorage.getItem("profile") ?? '')?.refreshToken;

    if (accessToken && refreshToken) {
        if (isValidToken(accessToken)) {
            dispatch(setAccessToken(accessToken));
            dispatch(setRefreshToken(refreshToken));
            dispatch(setUserData(JSON.parse(localStorage.getItem("profile") ?? '').user));
        } else {
            await dispatch(refreshTokenAction(refreshToken));
        }
    }
};

export const refreshTokenAction = (refreshToken: any) => async (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    try {
      const response = await API.post("/users/refresh-token", {
        refreshToken,
      });
      const profile = JSON.parse(localStorage.getItem("profile") ?? '');
      const payload = response.data;
      localStorage.setItem("profile", JSON.stringify({ ...profile, ...payload }));
      dispatch({
        type: "REFRESH_TOKEN_SUCCESS",
        payload: payload,
      });
    } catch (error: any) {
      localStorage.removeItem("profile");
      dispatch({
        type: "REFRESH_TOKEN_FAIL",
        payload: error.response.data,
      });
    }
  };

export const setAccessToken = (accessToken: any) => async (dispatch: (arg0: { type: any; payload: any; }) => void) => {
    dispatch({ type: types.SET_ACCESS_TOKEN, payload: accessToken });
};

export const setRefreshToken = (refreshToken: any) => async (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({ type: types.SET_REFRESH_TOKEN, payload: refreshToken });
};

export const setUserData = (userData: any) => async (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({ type: types.SET_USER_DATA, payload: userData });
};

export const setInitialAuthState = (navigate: (arg0: string) => void) => async (dispatch: (arg0: { type: string; }) => any) => {
    await dispatch({ type: types.LOGOUT });
    navigate("/signin");
};


import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { useSelector } from "react-redux";
const API = axios.create({
    baseURL: baseURL,
    headers: { "Content-Type": "application/json", },
});

API.interceptors.request.use((req) => {
    const accessToken = JSON.parse(localStorage.getItem("profile") ?? '')?.accessToken;
    if (accessToken) {
        req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
});


export const authAction = (data: any, navigate: NavigateFunction) => async (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    try {
        console.log(data);
        // const response = await api.signIn(req.get('code'));
        const error = false;
        if (error) {
            dispatch({
                type: types.SIGNIN_FAIL,
                payload: error,
            });
        } else {
            console.log(data);
            const { user, accessToken, } = data;
            const profile = {
                user,
                accessToken,
              };
            localStorage.setItem("profile", JSON.stringify(profile));
            dispatch({
                type: types.SIGNIN_SUCCESS,
                payload: profile,
            });
            const userData = useSelector((state: any) => state.auth?.userData);
            console.log(userData);
            navigate("/");
        }
    } catch (error) {
        await dispatch({
            type: types.SIGNIN_FAIL,
            payload: types.ERROR_MESSAGE,
        });
        navigate("/");
    }
};
