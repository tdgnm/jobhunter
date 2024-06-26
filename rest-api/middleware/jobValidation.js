const handleError = require('./handleValidationError')
const { body } = require('express-validator')

module.exports = {
  validateCreate: [
    body('company')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Company is required'),
    body('position')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Position is required'),
    body('description')
      .exists()
      .withMessage('Description is required (can be empty)'),
    body('salaryFrom')
      .exists()
      .withMessage('SalaryFrom is required')
      .isInt({ min: 0 })
      .withMessage('SalaryFrom must be a non-negative integer'),
    body('salaryTo')
      .exists()
      .withMessage('SalaryTo is required')
      .isInt({ min: 0 })
      .withMessage('SalaryTo must be a non-negative integer')
      .custom((value, { req }) => value >= req.body.salaryFrom)
      .withMessage('SalaryTo must be greater than or equal to SalaryFrom'),
    body('type')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Type is required')
      .isIn(['full-time', 'part-time', 'internship'])
      .withMessage('Invalid type'),
    body('city')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    body('homeOffice')
      .exists()
      .withMessage('HomeOffice is required')
      .isBoolean()
      .withMessage('HomeOffice must be a boolean'),
    handleError,
  ],
}