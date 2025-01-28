import { body, param, validationResult, query } from 'express-validator';

const validateAddItem = [
    body().custom((value, { req }) => {
        const allowedFields = ['name', 'description', 'price', 'quantity', 'category'];
        const receivedFields = Object.keys(req.body);
        const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
        }
        return true;
    }),

    body('name')
        .escape()
        .trim()
        .notEmpty().withMessage('Name should not be empty')
        .isLength({ min: 3 }).withMessage('Name should be at least 3 characters long'),

    body('description')
        .escape()
        .trim()
        .optional()
        .isString().withMessage('Description should be a string'),

    body('price')
        .escape()
        .isNumeric().withMessage('Price should be a number')
        .isFloat({ min: 0 }).withMessage('Price should be a non-negative number'),
    
    body('quantity')
        .escape()
        .isNumeric().withMessage('Quantity should be a number')
        .isInt({ min: 0 }).withMessage('Quantity should be a non-negative integer'),
    

    body('category')
        .escape()
        .trim()
        .notEmpty().withMessage('Category should not be empty')
        .isString().withMessage('Category should be a string'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors.array() 
            })
        }
        next()
    }
]

const validateGetItems = [
    query('category').optional().isString().trim(),
    query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
    query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
    query('sortBy').optional().isIn(['price', 'quantity', 'totalCost']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
    (req, res, next) => {
      const { minPrice, maxPrice } = req.query;
      if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
        return res.status(400).json({ error: 'minPrice cannot exceed maxPrice' });
      }
      next();
    }
]

const validateGetItemById = [
    param('id')
        .escape()
        .isMongoId().withMessage('Invalid item ID'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors.array() 
            })
        }
        next()
    }
]

const validateUpdateItem = [
    param('id')
        .escape()
        .isMongoId().withMessage('Invalid item ID'),

    body().custom((value, { req }) => {
        const allowedFields = ['name', 'description', 'price', 'quantity', 'category'];
        const receivedFields = Object.keys(req.body);
        const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
        }
        return true;
    }),

    body('name')
        .escape()
        .trim()
        .optional()
        .isLength({ min: 3 }).withMessage('Name should be at least 3 characters long'),

    body('description')
        .escape()
        .trim()
        .optional()
        .isString().withMessage('Description should be a string'),

    body('price')
        .escape()
        .optional()
        .isNumeric().withMessage('Price should be a number')
        .isFloat({ min: 0 }).withMessage('Price should be a non-negative number'),
    
    body('quantity')
        .escape()
        .optional()
        .isNumeric().withMessage('Quantity should be a number')
        .isInt({ min: 0 }).withMessage('Quantity should be a non-negative integer'),
    

    body('category')
        .escape()
        .trim()
        .optional()
        .isString().withMessage('Category should be a string'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors.array() 
            })
        }
        next()
    }
]

const validateDeleteItem = [
    param('id')
        .escape()
        .isMongoId().withMessage('Invalid item ID'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors.array() 
            })
        }
        next()
    }
]

export { validateAddItem, validateGetItems, validateGetItemById, validateUpdateItem, validateDeleteItem }