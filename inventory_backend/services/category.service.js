const db = require("../models");
const Category = db.Categories;
const { Op } = require("sequelize");

// CREATE CATEGORY
exports.createCategory = async (data) => {

    if (!data.name || data.name.trim() === "") {
        throw new Error("Category name is required");
    }

    const existing = await Category.findOne({
        where: { name: data.name.trim(), isDeleted: false },
    });

    if (existing) {
        throw new Error("Category already exists");
    }

    try {
        const category = await Category.create({
            name: data.name.trim(),
            description: data.description || null,
        });

        return category;

    } catch (err) {
        console.error("Sequelize Error:", err);
        throw new Error("Database validation failed");
    }
};



// UPDATE CATEGORY
exports.updateCategory = async (id, data) => {
    const category = await Category.findOne({
        where: { id, isDeleted: false },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    // check duplicate name
    if (data.name) {
        const existing = await Category.findOne({
            where: {
                name: data.name,
                id: { [Op.ne]: id },
                isDeleted: false,
            },
        });

        if (existing) throw new Error("Category name already exists");
    }

    await category.update(data);
    return category;
};

// SOFT DELETE CATEGORY
exports.deleteCategory = async (id) => {
    const category = await Category.findOne({
        where: { id, isDeleted: false },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    await category.update({ isDeleted: true });
    return true;
};

// CATEGORY LIST (search + pagination)
exports.getCategories = async ({ page = 1, limit = 10, search = "" }) => {
    const offset = (page - 1) * limit;

    const result = await Category.findAndCountAll({
        where: {
            isDeleted: false,
            name: { [Op.iLike]: `%${search}%` },
        },
        order: [["createdAt", "DESC"]],
        limit: +limit,
        offset: +offset,
    });

    return {
        total: result.count,
        page: +page,
        pages: Math.ceil(result.count / limit),
        data: result.rows,
    };
};