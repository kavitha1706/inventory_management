var express = require('express');
var router = express.Router();
const controller = require("../controller/dashboard.controller");
const auth = require("../middleware/auth.middleware");

router.get("/stats", auth, controller.getStats);

module.exports = router;
