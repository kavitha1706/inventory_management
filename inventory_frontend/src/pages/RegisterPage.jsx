import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { registerUser } from "../api/authApi";
import toast from "react-hot-toast";

const roles = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "staff", label: "Staff" },
];

const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "staff",
};

const validate = (values) => {
    const errors = {};
    if (!values.name.trim()) errors.name = "Full name is required";
    else if (values.name.trim().length < 2) errors.name = "Name too short";

    if (!values.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = "Invalid email";

    if (!values.password) errors.password = "Password required";
    else if (values.password.length < 6) errors.password = "Min 6 characters";

    if (!values.confirmPassword) errors.confirmPassword = "Confirm password";
    else if (values.confirmPassword !== values.password)
        errors.confirmPassword = "Passwords do not match";

    return errors;
};

export default function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
        useForm(initialValues, validate, async (vals) => {
            setLoading(true);
            try {
                const { confirmPassword, ...payload } = vals;
                const res = await registerUser(payload);
                setSuccess(true);
                toast.success(res.data.msg || "Account created!");
                setTimeout(() => navigate("/login"), 2000);
            } catch (err) {
                toast.error(
                    err.response?.data?.msg || "Registration failed. Try again."
                );
            } finally {
                setLoading(false);
            }
        });

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-2xl text-center">
                    <div className="text-6xl text-green-400 mb-3">✔</div>
                    <h2 className="text-2xl font-bold">Account Created!</h2>
                    <p className="text-gray-400 mt-2">Redirecting to login...</p>
                    <div className="mt-4 animate-spin border-4 border-purple-400 border-t-transparent rounded-full w-6 h-6 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-white">

                {/* Logo */}
                <div className="text-center mb-5">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                        InvenTrack
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Join your team's inventory system
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Name */}
                    <Input label="Full Name" name="name" values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />

                    {/* Email */}
                    <Input label="Email" name="email" type="email" values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />

                    {/* Role */}
                    <div>
                        <select
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                            {roles.map((r) => (
                                <option key={r.value} value={r.value} className="text-black">
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Password */}
                    <Input label="Password" name="password" type="password" values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />

                    {/* Confirm Password */}
                    <Input label="Confirm Password" name="confirmPassword" type="password" values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />

                    <PasswordStrength password={values.password} />

                    <button
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </form>

                <p className="text-gray-400 text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-300 font-semibold">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

/* ---------- Input Component ---------- */
function Input({ label, name, type = "text", values, errors, touched, handleChange, handleBlur }) {
    return (
        <div>
            <input
                type={type}
                name={name}
                placeholder={label}
                value={values[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {touched[name] && errors[name] && (
                <p className="text-red-400 text-xs mt-1">{errors[name]}</p>
            )}
        </div>
    );
}

/* ---------- Password Strength ---------- */
function PasswordStrength({ password }) {
    if (!password) return null;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
        { w: "25%", label: "Weak", color: "bg-red-400" },
        { w: "50%", label: "Fair", color: "bg-orange-400" },
        { w: "75%", label: "Good", color: "bg-yellow-400" },
        { w: "100%", label: "Strong", color: "bg-green-400" },
    ];

    const level = levels[Math.min(score, 3)];

    return (
        <div className="mt-1">
            <div className="flex justify-between text-xs text-gray-400">
                <span>Password strength</span>
                <span className="font-semibold">{level.label}</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded mt-1">
                <div className={`${level.color} h-1 rounded`} style={{ width: level.w }} />
            </div>
        </div>
    );
}