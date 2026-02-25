import axiosInstance from "./axiosInstance";

export const getProducts = (params) => axiosInstance.get("/product", { params });

export const createProduct = (formData) => {
    return axiosInstance.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const updateProduct = (id, formData) => {
    return axiosInstance.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const deleteProduct = (id) => axiosInstance.delete(`/product/${id}`);

export const getStockData = (params) => axiosInstance.get("/product/stockData-get", { params });
