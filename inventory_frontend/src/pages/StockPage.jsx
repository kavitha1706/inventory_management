import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import { getStockData } from "../api/productApi";
import { getCategories } from "../api/categoryApi";
import toast from "react-hot-toast";

const StockPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const [filters, setFilters] = useState({
        categoryId: "",
        status: ""
    });

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data?.data || []);
        } catch {
            toast.error("Failed to load categories");
        }
    };

    const fetchStockData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getStockData({
                categoryId: filters.categoryId,
                status: filters.status,
                page,
                limit
            });
            setProducts(res.data?.data || []);
            setTotalPages(res.data?.pages || 1);
        } catch {
            toast.error("Failed to fetch stock data");
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchStockData();
    }, [fetchStockData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1); // Reset to page 1 on filter change
    };

    return (
        <Layout>
            {/* PAGE HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-slate-800">Stock Management</h1>
                <p className="text-slate-500 text-sm">
                    Monitor stock levels and filter inventory quickly
                </p>
            </div>

            {/* FILTER CARD */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-5">
                <div className="flex flex-col sm:flex-row gap-3">

                    {/* CATEGORY FILTER */}
                    <select
                        name="categoryId"
                        value={filters.categoryId}
                        onChange={handleFilterChange}
                        className="w-full sm:w-60 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    {/* STATUS FILTER */}
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full sm:w-60 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                        <option value="">All Status</option>
                        <option value="in-stock">In Stock</option>
                        <option value="low-stock">Low Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                    </select>

                </div>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
                <div className="overflow-x-auto flex-grow">
                    <table className="w-full text-left text-sm">

                        {/* TABLE HEADER */}
                        <thead className="bg-slate-50 text-slate-500 font-semibold">
                            <tr>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Quantity</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>

                        {/* TABLE BODY */}
                        <tbody className="divide-y divide-slate-100">

                            {/* LOADING */}
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-14 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-slate-400 text-sm">Loading stock data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (

                                /* EMPTY */
                                <tr>
                                    <td colSpan="5" className="px-6 py-14 text-center text-slate-400">
                                        No products found.
                                    </td>
                                </tr>

                            ) : (

                                /* ROWS */
                                products.map(prod => (
                                    <tr key={prod.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-3 font-semibold text-slate-700">
                                            {prod.name}
                                        </td>

                                        <td className="px-6 py-3 text-slate-500">
                                            <span className="bg-slate-100 px-2 py-1 rounded-md text-xs">
                                                {prod.category?.name || "Uncategorized"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-3 font-semibold">
                                            <span className={
                                                prod.quantity === 0 ? "text-rose-500" :
                                                    prod.quantity <= 10 ? "text-amber-500" :
                                                        "text-slate-700"
                                            }>
                                                {prod.quantity}
                                            </span>
                                        </td>

                                        <td className="px-6 py-3 text-slate-600 font-medium">
                                            ₹{prod.price}
                                        </td>

                                        <td className="px-6 py-3">
                                            <span className={
                                                `px-2 py-1 rounded-full text-xs font-semibold
                                                ${prod.quantity === 0
                                                    ? "bg-rose-50 text-rose-600"
                                                    : prod.quantity <= 10
                                                        ? "bg-amber-50 text-amber-600"
                                                        : "bg-emerald-50 text-emerald-600"}`
                                            }>
                                                {prod.quantity === 0
                                                    ? "Out of Stock"
                                                    : prod.quantity <= 10
                                                        ? "Low Stock"
                                                        : "In Stock"}
                                            </span>
                                        </td>
                                    </tr>
                                ))

                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between mt-auto">
                    <p className="text-xs text-slate-500 font-medium">
                        Page <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                            className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StockPage;