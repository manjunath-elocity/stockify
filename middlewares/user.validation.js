import { body, validationResult } from 'express-validator';

const validateRegister = [
    body().custom((value, { req }) => {
        const allowedFields = ['firstName', 'lastName', 'emailId', 'password'];
        const receivedFields = Object.keys(req.body);
        const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
        }
        return true;
    }),

    body('firstName')
        .escape()
        .trim()
        .notEmpty().withMessage('First name should not be empty')
        .isLength({ min: 2, max: 25 }).withMessage('First name should be between 2 and 25 characters')
        .isAlpha().withMessage('First name should contain only alphabets')
        .matches(/^[A-Za-z]+$/).withMessage('First name should not contain spaces'),

    body('lastName')
        .escape()
        .trim()
        .optional()
        .isLength({ max: 25 }).withMessage('Last name should be less than 25 characters')
        .isAlpha().withMessage('Last name should contain only alphabets')
        .matches(/^[A-Za-z]*$/).withMessage('Last name should not contain spaces'),

    body('emailId')
        .escape()
        .trim()
        .notEmpty().withMessage('Email should not be empty')
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .escape()
        .trim()
        .notEmpty().withMessage('Password should not be empty')
        .isLength({ min: 8 }).withMessage('Password should be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/).withMessage('Password should contain at least one number, one uppercase letter, one lowercase letter, and one special character'),

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

const validateLogin = [
    body().custom((value, { req }) => {
        const allowedFields = ['emailId', 'password'];
        const receivedFields = Object.keys(req.body);
        const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
        }
        return true;
    }),

    body('emailId')
        .escape()
        .trim()
        .notEmpty().withMessage('Email should not be empty')
        .isEmail().withMessage('Invalid email address'),


    body('password')
        .escape()
        .trim()
        .notEmpty().withMessage('Password should not be empty'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
]

export default { validateRegister, validateLogin }