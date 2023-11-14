import * as types from "../constants/auth.constants";
import * as api from "../api/authAPI";
import { isValidToken } from "../../utils/auth.utils";

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
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { "Content-Type": "application/json", },
});

API.interceptors.request.use((req) => {
    const accessToken = JSON.parse(localStorage.getItem("profile") ?? '')?.accessToken;
    if (accessToken) {
        req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
});

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

export const signInAction = (req: URLSearchParams, navigate: NavigateFunction) => async (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    try {
        const response = await api.signIn(req);
        const { error, data } = response;
        if (error) {
          dispatch({
            type: types.SIGNIN_FAIL,
            payload: error,
          });
        } else {
          const { user, accessToken, refreshToken, accessTokenUpdatedAt } = data;
          const profile = {
            user,
            accessToken,
            refreshToken,
            accessTokenUpdatedAt,
          };
          localStorage.setItem("profile", JSON.stringify(profile));
          dispatch({
            type: types.SIGNIN_SUCCESS,
            payload: profile,
          });
          navigate("/");
        }
      } catch (error) {
        await dispatch({
          type: types.SIGNIN_FAIL,
          payload: types.ERROR_MESSAGE,
        });
        navigate("/signin");
      }
};