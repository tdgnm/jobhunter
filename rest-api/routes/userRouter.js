require('dotenv').config()
const { StatusCodes } = require('http-status-codes')
const { validateCreate, validateAuth } = require('../middleware/userValidation')
const { authenticate, isCompany } = require('../middleware/authentication')
const jwt = require('jsonwebtoken')
const express = require('express')
const { User } = require('../models')

const secret = process.env.JWT_SECRET || 'secret'
const router = express.Router()


router.post('/', validateCreate, async (req, res) => {
  const { email, password, fullName, role } = req.body
  const existing = await User.findOne({ where: { email } })
  if (existing) {
    return res.status(StatusCodes.CONFLICT).json({ message: 'User already exists' })
  }

  const user = await User.create({ email, password, fullName, role })
  res.status(StatusCodes.CREATED).json(user)
})


router.post('/auth', validateAuth, async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  
  if (!user.comparePassword(password)) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' })
  }
  
  const accessToken = jwt.sign({ payload: user.toJSON() }, secret, { expiresIn: '1d' })
  res.json({ accessToken, user: user.toJSON() })
})


router.delete('/:id', authenticate, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  if (user.id !== req.user.id) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
  }

  await user.destroy()
  res.json({ message: 'User deleted successfully' })
})


router.get('/', authenticate, isCompany, async (req, res) => {
  const users = await User.findAll({ where: { role: 'jobSeeker' } })
  res.json(users)
})


router.get('/:id', authenticate, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  if (user.id !== req.user.id) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
  }

  res.json(user.toJSON())
})


module.exports = router