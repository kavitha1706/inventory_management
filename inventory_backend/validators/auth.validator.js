const { body } = require('express-validator');

const authValidator = {
    register: [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').optional().isIn(['admin', 'manager', 'staff']).withMessage('Invalid role'),
    ],
    login: [
        body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required'),
    ]
};

module.exports = authValidator;
