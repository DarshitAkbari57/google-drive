import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // include cookies (useful for session-based auth)
});

// 🔐 Add interceptor to attach token from localStorage to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Common methods
export const apiPost = async (url, data) => {
  const response = await axiosInstance.post(url, data);
  return response.data;
};

export const apiGet = async (url) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

export const apiPut = async (url, data) => {
  const response = await axiosInstance.put(url, data);
  return response.data;
};

export const apiDelete = async (url) => {
  const response = await axiosInstance.delete(url);
  return response.data;
};

export const apiUploadFile = async (file, id = null) => {
  const formData = new FormData();
  formData.append("file", file);

  const url = id ? `files/upload/${id}` : `files/upload`;

  const response = await axiosInstance.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export default axiosInstance;
