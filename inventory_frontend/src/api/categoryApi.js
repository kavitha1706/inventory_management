import axiosInstance from "./axiosInstance";

export const getCategories = (params) => axiosInstance.get("/category", { params });

export const createCategory = (data) => axiosInstance.post("/category", data);

export const updateCategory = (id, data) => axiosInstance.put(`/category/${id}`, data);

export const deleteCategory = (id) => axiosInstance.delete(`/category/${id}`);
