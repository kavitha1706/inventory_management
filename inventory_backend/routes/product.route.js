var express = require('express');
var router = express.Router();
const controller = require("../controller/product.controller");

const auth = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/rbac");
const upload = require("../middleware/upload.middleware");
const validator = require('../validators/product.validator');
const validate = require('../middleware/validate');

router.get("/", auth, allowRoles("admin", "manager", "staff"), controller.getProducts);

router.get("/stockData-get", auth, allowRoles("admin", "manager", "staff"), controller.getStockData);

router.post("/", auth, allowRoles("admin", "manager"), upload.single("image"), validator.createProduct, validate, controller.createProduct);

router.put("/:id", auth, allowRoles("admin", "manager"), upload.single("image"), validator.updateProduct, validate, controller.updateProduct);

router.delete("/:id", auth, allowRoles("admin", "manager"), validator.deleteProduct, validate, controller.deleteProduct);

module.exports = router;