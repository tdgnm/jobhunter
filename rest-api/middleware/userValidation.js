const handleError = require('./handleValidationError')
const { body } = require('express-validator')

module.exports = {
  validateCreate: [
    body('email')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid format'),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long'),
    body('fullName')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Full name is required'),
    body('role')
      .exists({ checkFalsy: true })
      .withMessage('Role is required')
      .isIn(['company', 'jobSeeker'])
      .withMessage('Invalid role'),
    handleError,
  ],

  validateAuth: [
    body('email')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid format'),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required'),
    handleError,
  ],
}