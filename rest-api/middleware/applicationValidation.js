const handleError = require('./handleValidationError')
const { body } = require('express-validator')

module.exports = {
  validateCreate: [
    body('jobId')
      .exists()
      .withMessage('jobId is required')
      .isInt({ min: 1 })
      .withMessage('Invalid jobId'),
    handleError,
  ],
}