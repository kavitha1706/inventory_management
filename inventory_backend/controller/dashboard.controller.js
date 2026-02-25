const dashboardService = require("../services/dashboard.service");

exports.getStats = async (req, res) => {
    try {
        const stats = await dashboardService.getStats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch dashboard stats" });
    }
};
