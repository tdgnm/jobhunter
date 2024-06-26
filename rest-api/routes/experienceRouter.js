const { StatusCodes } = require('http-status-codes')
const { validateCreate } = require('../middleware/experienceValidation')
const { authenticate, isUser } = require('../middleware/authentication')
const express = require('express')
const { User, Experience } = require('../models')

const router = express.Router()


router.post('/', authenticate, isUser, validateCreate, async (req, res) => {
  const { company, title, interval } = req.body
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }

  const experience = await user.createExperience({ company, title, interval })
  res.status(StatusCodes.CREATED).json(experience)
})


router.put('/:id', authenticate, isUser, validateCreate, async (req, res) => {
  const { company, title, interval } = req.body
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  const experience = await Experience.findByPk(req.params.id)
  if (!experience) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Experience not found' })
  }
  if (experience.userId !== user.id) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
  }

  const updatedExperience = await experience.update({ company, title, interval })
  res.json(updatedExperience)
})


router.delete('/:id', authenticate, isUser, async (req, res) => {
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  const experience = await Experience.findByPk(req.params.id)
  if (!experience) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Experience not found' })
  }
  if (experience.userId !== user.id) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
  }

  await experience.destroy()
  res.json({ message: 'Experience deleted successfully' })
})


router.get('/', authenticate, async (req, res) => {
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  let experiences
  if (user.role === 'jobSeeker') {
    experiences = await Experience.findAll({ where: { userId: user.id } })
  } else if (req.query.userId) {
    const { userId } = req.query
    const applicant = await User.findByPk(userId)
    if (!applicant) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
    }
    experiences = await Experience.findAll({ where: { userId } })
  } else {
    experiences = await Experience.findAll()
  }

  res.json(experiences)
})


router.get('/:id', authenticate, async (req, res) => {
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  const experience = await Experience.findByPk(req.params.id)
  if (!experience) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Experience not found' })
  }
  if (user.role === 'jobSeeker' && experience.userId !== user.id) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
  }

  res.json(experience)
})


module.exports = router