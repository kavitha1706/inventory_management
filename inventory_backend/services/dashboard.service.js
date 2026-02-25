const db = require("../models");
const Product = db.Products;
const Category = db.Categories;
const { Op } = require("sequelize");

exports.getStats = async () => {
    const totalProducts = await Product.count({ where: { isDeleted: false } });
    const totalCategories = await Category.count({ where: { isDeleted: false } });

    const lowStockItems = await Product.findAll({
        where: {
            isDeleted: false,
            quantity: { [Op.and]: [{ [Op.gt]: 0 }, { [Op.lte]: 10 }] }
        },
    });

    const stockSummary = await Product.sum('quantity', { where: { isDeleted: false } });

    return {
        totalProducts,
        totalCategories,
        lowStockCount: lowStockItems.length,
        availableStock: stockSummary || 0,
        lowStockItems: lowStockItems.map(p => ({
            name: p.name,
            price: `₹${p.price}`,
            qty: p.quantity
        }))
    };
};
