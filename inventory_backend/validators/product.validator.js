const { body, param } = require('express-validator');

const productValidator = {
    createProduct: [
        body('name').trim().notEmpty().withMessage('Product name is required'),
        body('categoryId').notEmpty().withMessage('Category ID is required'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
        body('description').optional().trim(),
    ],
    updateProduct: [
        param('id').isInt().withMessage('Invalid Product ID'),
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
        body('categoryId').optional().notEmpty().withMessage('Category cannot be empty'),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
        body('description').optional().trim(),
    ],
    deleteProduct: [
        param('id').isInt().withMessage('Invalid Product ID'),
    ]
};

module.exports = productValidator;