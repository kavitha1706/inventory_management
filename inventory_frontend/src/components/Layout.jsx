import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
    LayoutDashboard,
    Box,
    Folders,
    BarChart3,
    LogOut,
    ShieldCheck,
    Menu,
    Package
} from "lucide-react";

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Products", icon: Box, path: "/products" },
        { name: "Categories", icon: Folders, path: "/category" },
        { name: "Stock", icon: BarChart3, path: "/stock" },
    ];

    return (
        <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-[#0f172a] transition-all duration-300 flex flex-col shrink-0 fixed inset-y-0 z-50 border-r border-slate-800`}>

                {/* Logo Section */}
                <div className="p-6 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl">
                            <Package className="text-white w-6 h-6" />
                        </div>
                        {sidebarOpen && (
                            <span className="text-white font-bold text-xl tracking-tight">
                                InvenTrack
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-white"}`} />
                                {sidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section - User Profile */}
                <div className="p-4 mt-auto border-t border-slate-800/50">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-slate-700 shadow-inner">
                            {user?.name?.[0] || "A"}
                        </div>
                        {sidebarOpen && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-white text-sm font-semibold truncate leading-tight">
                                    {user?.name || "Admin User"}
                                </span>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="bg-blue-900/40 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                        {user?.role || "admin"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-20"}`}>

                {/* Mobile Toggle / Header Placeholder */}
                <header className="h-16 flex items-center px-6 shrink-0 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors border border-slate-200 shadow-sm"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </header>

                {/* Page Content */}
                <main className="p-8 flex-1 max-w-[1600px] w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
