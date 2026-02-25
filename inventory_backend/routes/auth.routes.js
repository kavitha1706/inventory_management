var express = require('express');
var router = express.Router();

const authController = require('../controller/auth.controller');
const validator = require('../validators/auth.validator');
const validate = require('../middleware/validate');

router.post("/register", validator.register, validate, authController.registerUSer);
router.post("/login", validator.login, validate, authController.loginUser);

module.exports = router;