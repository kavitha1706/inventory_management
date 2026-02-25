import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { getDashboardStats } from "../api/dashboardApi";
import toast from "react-hot-toast";

const DashboardPage = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getDashboardStats();
                setData(res.data);
            } catch (err) {
                toast.error("Failed to load dashboard statistics");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            label: "Total Products",
            value: data?.totalProducts || 0,
            gradient: "from-indigo-500 to-indigo-400",
            icon: "📦",
        },
        {
            label: "Total Categories",
            value: data?.totalCategories || 0,
            gradient: "from-green-500 to-emerald-400",
            icon: "📁",
        },
        {
            label: "Low Stock Items",
            value: data?.lowStockCount || 0,
            gradient: "from-orange-500 to-amber-400",
            icon: "⚠️",
        },
        {
            label: "Available Stock",
            value: data?.availableStock || 0,
            gradient: "from-blue-500 to-cyan-400",
            icon: "📈",
        },
    ];

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-medium animate-pulse text-sm">Loading dashboard data...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800">
                    Welcome back, {user?.name || "Admin User"}
                </h1>
                <p className="text-slate-500 text-sm">
                    Here's an overview of your inventory
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`bg-gradient-to-r ${stat.gradient} text-white rounded-xl shadow-md p-5 flex justify-between items-center transition hover:scale-[1.02] duration-200 cursor-default`}
                    >
                        <div>
                            <p className="text-xs opacity-90 uppercase tracking-wider font-semibold">{stat.label}</p>
                            <h2 className="text-3xl font-bold mt-1">{stat.value}</h2>
                        </div>

                        <div className="text-4xl opacity-80">{stat.icon}</div>
                    </div>
                ))}
            </div>

            {/* Low stock section */}
            <div className="mt-10 bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="bg-amber-100 p-1.5 rounded-lg">⚠️</span> Low Stock Alerts
                </h3>

                <div className="grid gap-4">
                    {data?.lowStockItems?.length > 0 ? (
                        data.lowStockItems.map((item, index) => (
                            <div
                                key={index}
                                className="border border-slate-100 bg-slate-50/30 rounded-lg px-4 py-3 flex justify-between items-center hover:bg-slate-50 transition border-l-4 border-l-amber-400"
                            >
                                <div>
                                    <p className="font-semibold text-slate-700">{item.name}</p>
                                    <p className="text-sm text-slate-500">{item.price}</p>
                                </div>

                                <span className="text-sm font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                                    {item.qty} left
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-400 text-center py-6 border-2 border-dashed rounded-xl border-slate-100">
                            Excellent! No low stock items at the moment.
                        </p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;
