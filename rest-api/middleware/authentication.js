const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET || 'secret'

module.exports = {
  authenticate: (req, res, next) => {
    const authHeather = req.headers.authorization
    const token = authHeather && authHeather.split(' ')[1]
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }

    jwt.verify(token, secret, (err, { payload }) => {
      if (err) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
      }
      req.user = payload
      next()
    })
  },

  isCompany: (req, res, next) => {
    if (req.user?.role !== 'company') {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
    }
    next()
  },

  isUser: (req, res, next) => {
    if (req.user?.role !== 'jobSeeker') {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
    }
    next()
  },
}