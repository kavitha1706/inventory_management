import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import { getProducts, deleteProduct } from "../api/productApi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import ProductModal from "../components/ProductModal";
import { Plus, Pencil, Trash2 } from 'lucide-react';

const ProductPage = () => {
    const { user } = useAuth();
    const isStaff = user?.role === "staff";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("createdAt");
    const [order, setOrder] = useState("DESC");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getProducts({ search, sort, order, page, limit });
            setProducts(res.data?.data || []);
            setTotalPages(res.data?.pages || 1);
        } catch (err) {
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    }, [search, sort, order, page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const handleAddClick = () => {
        setCurrentProduct(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            toast.success("Product deleted");
            fetchProducts();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleSort = (field) => {
        const isSameField = sort === field;
        const newOrder = isSameField && order === "ASC" ? "DESC" : "ASC";
        setSort(field);
        setOrder(newOrder);
    };

    const SortIcon = ({ field }) => {
        if (sort !== field) return <span className="ml-1 opacity-20">⇅</span>;
        return <span className="ml-1 text-indigo-600">{order === "ASC" ? "↑" : "↓"}</span>;
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-light text-slate-700">Manage Products</h2>
                    <p className="text-slate-500 text-sm">View and manage system inventory</p>
                </div>
                {!isStaff && (
                    <button
                        onClick={handleAddClick}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 text-sm font-semibold transition-all flex items-center gap-2 w-fit active:scale-95"
                    >
                        <span className="text-lg">+</span> Add Product
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[600px]">
                <div className="p-4 border-b border-slate-50">
                    <div className="relative max-w-xs">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-50">
                            <tr>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors"
                                    onClick={() => handleSort("name")}
                                >
                                    Product Name <SortIcon field="name" />
                                </th>
                                <th className="px-6 py-4">Category</th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors"
                                    onClick={() => handleSort("quantity")}
                                >
                                    Qty <SortIcon field="quantity" />
                                </th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors"
                                    onClick={() => handleSort("price")}
                                >
                                    Price <SortIcon field="price" />
                                </th>
                                <th className="px-6 py-4">Status</th>
                                {!isStaff && <th className="px-6 py-4 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Loading products...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400 font-medium">No products found.</td>
                                </tr>
                            ) : (
                                products.map((prod) => (
                                    <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-semibold text-slate-700">
                                            <div className="flex items-center gap-3">

                                                {prod.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-slate-500">
                                            <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-medium">
                                                {prod.category?.name || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`${prod.quantity < 5 ? "text-rose-500 font-bold" : "text-slate-600 font-medium"}`}>
                                                {prod.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 font-semibold text-slate-700">${prod.price}</td>
                                        <td>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${prod.quantity === 0 ? 'bg-rose-50 text-rose-600' :
                                                prod.quantity <= 10 ? 'bg-amber-50 text-amber-600' :
                                                    'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                {prod.quantity === 0 ? 'Out of Stock' : prod.quantity <= 10 ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                        {!isStaff && (
                                            <td className="px-6 py-3 text-right">
                                                <div className="flex justify-end gap-1">                                                <button
                                                    onClick={() => handleEditClick(prod)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />


                                                </button>
                                                    <button
                                                        onClick={() => handleDelete(prod.id)}
                                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />

                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI */}
                <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
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

            {/* Product Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={currentProduct}
                onSuccess={fetchProducts}
            />
        </Layout>
    );
};

export default ProductPage;
