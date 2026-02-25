import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const initialValues = { email: "", password: "" };

const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = "Invalid email address";
    if (!values.password) errors.password = "Password is required";
    else if (values.password.length < 6) errors.password = "Minimum 6 characters";
    return errors;
};

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
        initialValues,
        validate,
        async (vals) => {
            setLoading(true);
            try {
                const res = await loginUser(vals);
                const { token, user, msg } = res.data;
                login(user, token);
                toast.success(msg || "Welcome back! 🎉");
                navigate("/dashboard");
            } catch (err) {
                const message = err.response?.data?.msg || "Login failed. Please try again.";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-hidden p-6">
            <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-primary/30 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-secondary/25 blur-[80px] animate-pulse-slow delay-1000"></div>
            <div className="absolute top-[40%] left-[10%] w-[200px] h-[200px] rounded-full bg-pink-500/10 blur-[60px] animate-pulse-slow delay-2000"></div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl p-8 sm:p-12 flex flex-col items-center gap-4 z-10 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/40">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent tracking-tighter">
                        InvenTrack
                    </h1>
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mt-2">Welcome back</h2>
                    <p className="text-sm text-slate-400 mt-1">Access your smart inventory dashboard</p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="w-full space-y-5 mt-4">
                    <div className="space-y-1">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-primary group-focus-within:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full bg-white/5 border ${touched.email && errors.email ? 'border-red-400' : 'border-white/10'} rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all`}
                            />
                        </div>
                        {touched.email && errors.email && <p className="text-xs text-red-400 ml-4">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-primary group-focus-within:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full bg-white/5 border ${touched.password && errors.password ? 'border-red-400' : 'border-white/10'} rounded-2xl py-3.5 pl-11 pr-12 text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary hover:text-secondary transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {touched.password && errors.password && <p className="text-xs text-red-400 ml-4">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : "Sign In"}
                    </button>
                </form>

                <div className="w-full flex items-center gap-4 my-2">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-xs text-slate-500 font-bold tracking-widest">OR</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <p className="text-sm text-slate-400">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-purple-300 font-bold hover:text-white transition-colors">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
