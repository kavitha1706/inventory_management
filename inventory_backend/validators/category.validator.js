const { body, param } = require('express-validator');

const categoryValidator = {
    createCategory: [
        body('name').trim().notEmpty().withMessage('Category name is required')
            .isLength({ max: 50 }).withMessage('Name too long'),
        body('description').optional().trim(),
    ],
    updateCategory: [
        param('id').isInt().withMessage('Invalid ID format'),
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
        body('description').optional().trim(),
    ],
    deleteCategory: [
        param('id').isInt().withMessage('Invalid ID format'),
    ]
};

module.exports = categoryValidator;
