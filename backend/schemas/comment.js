const { default: mongoose } = require("mongoose")
const { body } = require('express-validator');

module.exports.createCommmentReq = [
    body('postId')
        .custom(value => {
            return mongoose.Types.ObjectId(value);
        })
        .withMessage('Invalid postId'),
    body('userId')
        .custom(value => {
            return mongoose.Types.ObjectId(value);
        })
        .withMessage('Invalid userId'),
    body('body')
        .isLength({ min: 1, max: 500 })
        .optional()
        .withMessage('Comment length must be between 1 and 500 chars'),
];