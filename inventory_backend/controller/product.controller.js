const productService = require("../services/product.service");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
    try {

        const image = req.file ? req.file.filename : null;

        const product = await productService.createProduct({
            ...req.body,
            image
        });

        res.status(201).json({
            msg: "Product created successfully",
            product
        });

    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
    try {

        const image = req.file ? req.file.filename : undefined;

        const product = await productService.updateProduct(
            req.params.id,
            { ...req.body, ...(image && { image }) }
        );

        res.json({
            msg: "Product updated successfully",
            product
        });

    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
    try {

        await productService.deleteProduct(req.params.id);

        res.json({ msg: "Product deleted successfully" });

    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

// GET PRODUCT LIST
exports.getProducts = async (req, res) => {

    console.log(' getProducts:',);
    try {

        const { page, limit, search, sort, order, categoryId, status } = req.query;

        const result = await productService.getProducts({
            page,
            limit,
            search,
            sort,
            order,
            categoryId,
            status
        });

        res.json(result);

    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch products" });
    }
};

// GET STOCK DATA
exports.getStockData = async (req, res) => {
    try {
        const { categoryId, status } = req.query;

        const result = await productService.getProducts({
            categoryId,
            status,
            limit: 100 // Default to a larger limit for stock overview
        });

        res.json(result);

    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch stock data" });
    }
};