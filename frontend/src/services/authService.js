import api from "./api";

export const registerUser = async (userData) => {
  return api.post("/auth/register", userData);
};

export const loginUser = async (credentials) => {
  return api.post("/auth/login", credentials);
};

export const registerAdmin = async (adminData) => {
  return api.post("/auth/admin/register", adminData);
};

export const loginAdmin = async (credentials) => {
  return api.post("/auth/admin/login", credentials);
};