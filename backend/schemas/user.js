const { body } = require('express-validator');

module.exports.loginUserReq = [
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    body('password')
        .trim()
        .isLength({ min: 4, max: 40 })
        .withMessage("Password length must be between 4 and 40 chars"),
];


module.exports.registerUserReq = [
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    body('password')
        .trim()
        .isLength({ min: 4, max: 40 })
        .withMessage("Password length must be between 4 and 40 chars"),
    body('username')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Username length must be between 4 and 20 chars"),
    body('firstName')
        .optional(),
    body('lastName')
        .optional(),
];