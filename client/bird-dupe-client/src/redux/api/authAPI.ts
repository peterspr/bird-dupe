import axios from "axios";
const baseURL = 'http://localhost:3000'

const API = axios.create({
    baseURL: baseURL,
});

const handleApiError = async (error: any) => {
    try {
        const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
        const data = null;
        return { error: errorMessage, data };
    } catch (err) {
        throw new Error("An unexpected error occurred.");
    }
};

export const signIn = async (code: string | null) => {
    try {
        const res = await API.get("/auth/signin/redirect", {
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                code: code,
            },
        });
        return { error: null, data: res.data };
    } catch (error) {
        return handleApiError(error);
    }
};
  
export const signUp = async () => {
    try {
        const res = await API.post("/auth/signup", {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return { error: null, data: res.data };
    } catch (error: any) {
        return {
            error: error.response.data.errors,
            data: null,
        };
    }
};
  
export const logout = async () => {
    try  {
        const res = await API.post("/users/logout", {
            headers: {
                "Content-Type": "application/json",
            }, 
        });
        return { error: null, data: res.data };
    } catch (error) {
        return handleApiError(error);
    }
};