import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/categoryApi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from 'lucide-react';


const CategoryPage = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCategories({ search });
            setCategories(res.data?.data || []);
        } catch (err) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditData(category);
            setFormData({ name: category.name, description: category.description || "" });
        } else {
            setEditData(null);
            setFormData({ name: "", description: "" });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditData(null);
        setFormData({ name: "", description: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error("Name is required");

        setSubmitting(true);
        try {
            if (editData) {
                await updateCategory(editData.id, formData);
                toast.success("Category updated");
            } else {
                await createCategory(formData);
                toast.success("Category added");
            }
            handleCloseModal();
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.msg || "Action failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategory(id);
            toast.success("Category deleted");
            fetchCategories();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-light text-slate-700">Manage Categories</h2>
                    <p className="text-slate-500 text-sm">Add, edit, or remove product categories</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-2 rounded shadow-sm text-sm font-medium transition-colors flex items-center gap-2 w-fit"
                    >
                        <Plus className="h-4 w-4" /> Add Category
                    </button>
                )}
            </div>

            <div className="bg-white rounded shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-xs">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#f9f9f9] border border-slate-200 rounded px-3 py-1.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#3c8dbc]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#f9f9f9] text-slate-600 font-bold border-b">
                            <tr>
                                <th className="px-6 py-3">Category Name</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Created At</th>
                                {isAdmin && <th className="px-6 py-3 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400">Loading categories...</td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400">No categories found.</td>
                                </tr>
                            ) : (
                                categories.map((cat, idx) => (
                                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 font-semibold text-slate-700">{cat.name}</td>
                                        <td className="px-6 py-3 text-slate-500 max-w-xs truncate">{cat.description || "—"}</td>
                                        <td className="px-6 py-3 text-slate-500">
                                            {new Date(cat.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-3 text-right flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(cat)}
                                                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-[#3c8dbc] text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold">{editData ? "Edit Category" : "Add New Category"}</h3>
                            <button onClick={handleCloseModal} className="text-white hover:opacity-75 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Electronics, Furniture"
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3c8dbc]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the category..."
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3c8dbc]"
                                ></textarea>
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
                                >
                                    {submitting ? "Processing..." : editData ? "Save Changes" : "Add Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default CategoryPage;
