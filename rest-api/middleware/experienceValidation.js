const handleError = require('./handleValidationError')
const { body } = require('express-validator')

module.exports = {
  validateCreate: [
    body('company')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Company is required'),
    body('title')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Company is required'),
    body('interval')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Interval is required')
      .custom(interval => {
        if (!/^\d{4}-(\d{4})?$/.test(interval)) {
          return false
        } else {
          const [start, end] = interval.split('-').map(year => year)
          const currentYear = new Date().getFullYear()
          if ((end && (start > end || end > currentYear))
            || (!end && start > currentYear)) {
            return false
          }
          return true
        }
      })
      .withMessage('Invalid interval'),
    handleError,
  ],
}