const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");

const User = db.Users;

// ---------------- REGISTER ----------------
const registerUSer = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // check existing user
        const existing = await User.findOne({ where: { email } });
        if (existing)
            return res.status(400).json({ msg: "Email already registered" });

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "staff",
        });
        res.status(201).json({
            msg: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Registration failed" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ msg: "User not found" });

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ msg: "Invalid password" });

        // generate token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            msg: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Login failed" });
    }
};

// ---------------- GET PROFILE ----------------
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ["id", "name", "email", "role"],
        });

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch profile" });
    }
};

module.exports = {
    registerUSer, loginUser
}