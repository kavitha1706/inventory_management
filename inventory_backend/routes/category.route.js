var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/rbac");
const categoryController = require("../controller/category.controller");
const validator = require('../validators/category.validator');
const validate = require('../middleware/validate');

router.get("/", auth, categoryController.getCategories);
router.post("/", auth, allowRoles("admin"), validator.createCategory, validate, categoryController.createCategory);
router.put("/:id", auth, allowRoles("admin"), validator.updateCategory, validate, categoryController.updateCategory);
router.delete("/:id", auth, allowRoles("admin"), validator.deleteCategory, validate, categoryController.deleteCategory);

module.exports = router;