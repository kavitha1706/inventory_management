const db = require("../models");
const Product = db.Products;
const Category = db.Categories;
const { Op } = require("sequelize");

// CREATE PRODUCT
exports.createProduct = async (data) => {

  // check category exists
  const category = await Category.findOne({
    where: { id: data.categoryId, isDeleted: false }
  });

  if (!category) throw new Error("Invalid category");

  const product = await Product.create({
    name: data.name,
    categoryId: data.categoryId,
    quantity: data.quantity,
    price: data.price,
    description: data.description,
    image: data.image || null
  });

  return product;
};

// UPDATE PRODUCT
exports.updateProduct = async (id, data) => {

  const product = await Product.findOne({
    where: { id, isDeleted: false }
  });

  if (!product) throw new Error("Product not found");

  await product.update(data);
  return product;
};

// SOFT DELETE PRODUCT
exports.deleteProduct = async (id) => {

  const product = await Product.findOne({
    where: { id, isDeleted: false }
  });

  if (!product) throw new Error("Product not found");

  await product.update({ isDeleted: true });
  return true;
};

// PRODUCT LIST WITH SEARCH + PAGINATION + SORT
exports.getProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  sort = "createdAt",
  order = "DESC",
  categoryId = null,
  status = null
}) => {

  const allowedSort = ["name", "price", "quantity", "createdAt"];
  if (!allowedSort.includes(sort)) sort = "createdAt";

  const offset = (page - 1) * limit;

  const where = {
    isDeleted: false,
    name: { [Op.iLike]: `%${search}%` }
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (status) {
    if (status === "in-stock") {
      where.quantity = { [Op.gt]: 10 };
    } else if (status === "low-stock") {
      where.quantity = { [Op.and]: [{ [Op.gt]: 0 }, { [Op.lte]: 10 }] };
    } else if (status === "out-of-stock") {
      where.quantity = 0;
    }
  }

  const result = await Product.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"]
      }
    ],
    order: [[sort, order]],
    limit: Number(limit),
    offset: Number(offset)
  });

  return {
    total: result.count,
    page: Number(page),
    pages: Math.ceil(result.count / limit),
    data: result.rows
  };
};