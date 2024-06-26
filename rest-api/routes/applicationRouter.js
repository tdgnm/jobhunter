const { StatusCodes } = require('http-status-codes')
const { validateCreate } = require('../middleware/applicationValidation')
const { authenticate, isUser } = require('../middleware/authentication')
const express = require('express')
const { User, Job } = require('../models')

const router = express.Router()


router.post('/', authenticate, isUser, validateCreate, async (req, res) => {
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  const { jobId } = req.body
  const job = await Job.findByPk(jobId)
  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Job not found' })
  }
  if (await job.hasApplicant(user)) {
    return res.status(StatusCodes.CONFLICT).json({ message: 'Already applied' })
  }

  const application = await job.addApplicant(user)
  res.status(StatusCodes.CREATED).json(application)
})


router.delete('/:id', authenticate, isUser, async (req, res) => {
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  const job = await Job.findByPk(req.params.id)
  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Job not found' })
  }

  job.removeApplicant(user)
  res.json({ message: 'Application deleted successfully' })
})


router.get('/', authenticate, async (req, res) => {
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  const { jobId } = req.query
  const { userId } = req.query

  if (user.role === 'jobSeeker') {
    const applications = await user.getApplicant()
    const jobIds = []
    if (jobId) {
      const job = await Job.findByPk(jobId)
      if (!job) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Job not found' })
      }
      if (applications.some(application => application.dataValues.id === job.id)) {
        jobIds.push(jobId)
      }
    } else {
      applications.forEach(application => jobIds.push(application.dataValues.id))
    }

    const jobs = await Job.findAll({ where: { id: jobIds } })
    res.json(jobs)
    
  } else {
    if (!jobId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'jobId query parameter is required' })
    }
    const job = await Job.findByPk(jobId)
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Job not found' })
    }

    const applications = await job.getApplicant()
    const userIds = []
    if (userId) {
      const applicant = await User.findByPk(userId)
      if (!applicant) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
      }
      if (applications.some((application) => application.dataValues.id === applicant.id)) {
        userIds.push(userId)
      }
    } else {
      applications.forEach(application => userIds.push(application.dataValues.id))
    }

    const users = await User.findAll({ where: { id: userIds } })
    res.json(users)
  }
})


module.exports = router