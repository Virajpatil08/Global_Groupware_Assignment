import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const api = axios.create({
  baseURL: "https://reqres.in", 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("Session expired, please log in again.", { theme: "dark" });
        localStorage.removeItem("token"); 
        window.location.href = "/"; 
      } else if (error.response.status === 403) {
        toast.error("You are not authorized to perform this action.", { theme: "dark" });
      }
    } else if (error.message.includes("Network Error")) {
      toast.error("Network error, please check your internet connection.", { theme: "dark" });
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timed out, please try again.", { theme: "dark" });
    } else {
      toast.error("An unexpected error occurred.", { theme: "dark" });
    }
    return Promise.reject(error);
  }
);

// API service functions

// GET request
export const getRequest = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

// POST request
export const postRequest = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

// PUT request
export const putRequest = async (url, data) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error;
  }
};

// DELETE request
export const deleteRequest = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};

export default api;
