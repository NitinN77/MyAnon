const { default: mongoose } = require("mongoose")
const { body, param } = require('express-validator');

module.exports.createPostReq = [
    body('body')
        .isLength({ max: 1000 })
        .optional()
        .withMessage('Post body must have a max length of 1000 chars'),
    body('title')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title length must be between 1 and 200 chars'),
    body('authorId')
        .custom(value => {
            return mongoose.Types.ObjectId(value);
        })
        .withMessage('Invalid authorId')
];


module.exports.getPostByUserIdReq = [
    param('userId')
        .custom(value => {
            return mongoose.Types.ObjectId(value);
        })
        .withMessage('Invalid userId')
];


module.exports.getPostByIdReq = [
    param('postId')
        .custom(value => {
            return mongoose.Types.ObjectId(value);
        })
        .withMessage('Invalid postId')
];


module.exports.handlePlusOrMinusReq = [
    body('postId')
        .custom(value => {
            return mongoose.Types.ObjectId(value);
        })
        .withMessage('Invalid postId'),
    body('userId')
        .custom(value => {
            return mongoose.Types.ObjectId(value);
        })
        .withMessage('Invalid userId')
];


module.exports.deletePostReq = [
    body('postId')
        .custom(value => {
            return mongoose.Types.ObjectId(value);
        })
        .withMessage('Invalid postId'),
    body('userId')
        .custom(value => {
            return mongoose.Types.ObjectId(value);
        })
        .withMessage('Invalid userId')
];


module.exports.updatePostReq = [
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
        .isLength({ max: 1000 })
        .optional()
        .withMessage('Post body must have a max length of 1000 chars'),
];