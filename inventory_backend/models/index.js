const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ---------------- LOAD MODELS ----------------
db.Users = require("./User")(sequelize, Sequelize.DataTypes);
db.Categories = require("./Category")(sequelize, Sequelize.DataTypes);
db.Products = require("./Product")(sequelize, Sequelize.DataTypes);
// db.StockLogs = require("./StockLog")(sequelize, Sequelize.DataTypes);

// ---------------- ASSOCIATIONS ----------------

// Category → Products
db.Categories.hasMany(db.Products, {
    foreignKey: "categoryId",
    as: "products",
});
db.Products.belongsTo(db.Categories, {
    foreignKey: "categoryId",
    as: "category",
});

// Product → StockLogs
// db.Products.hasMany(db.StockLogs, {
//     foreignKey: "productId",
//     as: "stockLogs",
// });
// db.StockLogs.belongsTo(db.Products, {
//     foreignKey: "productId",
//     as: "product",
// });

// User → StockLogs
// db.Users.hasMany(db.StockLogs, {
//     foreignKey: "userId",
//     as: "stockLogs",
// });
// db.StockLogs.belongsTo(db.Users, {
//     foreignKey: "userId",
//     as: "user",
// });

module.exports = db;