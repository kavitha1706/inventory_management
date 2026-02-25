const categoryService = require("../services/category.service");

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ msg: "Category name required" });
        }

        const category = await categoryService.createCategory({
            name,
            description,
        });

        res.status(201).json({
            msg: "Category created successfully",
            category,
        });
    } catch (err) {
        res.status(500).json({
            msg: err.message || "Failed to create category",
        });
    }
};
// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategory(
            req.params.id,
            req.body
        );

        res.json({
            msg: "Category updated successfully",
            category,
        });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

// DELETE CATEGORY (soft)
const deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);

        res.json({ msg: "Category deleted successfully" });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

// LIST CATEGORIES
const getCategories = async (req, res) => {
    try {
        const { page, limit, search } = req.query;

        const result = await categoryService.getCategories({
            page,
            limit,
            search,
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch categories" });
    }
};
module.exports = { createCategory, updateCategory, deleteCategory, getCategories }