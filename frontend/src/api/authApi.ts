import API from "./api";

// Auth API calls
export const signup = (data: any) => API.post("/auth/signup", data);
export const verifyOtp = (data: any) => API.post("/auth/verify-otp", data);
export const login = (data: any) => API.post("/auth/login", data);
