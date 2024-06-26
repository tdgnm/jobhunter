const { StatusCodes } = require('http-status-codes')
const { Op } = require('sequelize')
const { validateCreate } = require('../middleware/jobValidation')
const { authenticate, isCompany } = require('../middleware/authentication')
const express = require('express')
const { User, Job } = require('../models')

const router = express.Router()


router.post('/', authenticate, isCompany, validateCreate, async (req, res) => {
  const { company, position, description, salaryFrom, salaryTo, type, city, homeOffice } = req.body
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }

  const job = await user.createJob({ company, position, description, salaryFrom, salaryTo, type, city, homeOffice })
  res.status(StatusCodes.CREATED).json(job)
})


router.put('/:id', authenticate, isCompany, validateCreate, async (req, res) => {
  const { company, position, description, salaryFrom, salaryTo, type, city, homeOffice } = req.body
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  const job = await Job.findByPk(req.params.id)
  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Job not found' })
  }
  if (job.userId !== user.id) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
  }

  await job.update({ company, position, description, salaryFrom, salaryTo, type, city, homeOffice })
  res.json(job)
})


router.delete('/:id', authenticate, isCompany, async (req, res) => {
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
  }
  const job = await Job.findByPk(req.params.id)
  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Job not found' })
  }
  if (job.userId !== user.id) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
  }

  await job.destroy()
  res.json({ message: 'Job deleted successfully' })
})


router.get('/', async (req, res) => {
  const { query } = req
  const queryParams = Object.entries(query)
  const operators = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
  }
  queryParams.forEach(([key, value]) => {
    query[key] = Object(value) !== value
      ? query[key]
      : Object.entries(query[key]).reduce((acc, [k, v]) => {
        if (k === '$like') {
          acc[Op.like] = v
        } else {
          acc[operators[k]] = v
        }
        return acc
      }, {})
  })

  const jobs = await Job.findAll({ where: query })
  res.json(jobs)
})


router.get('/:id', async (req, res) => {
  const job = await Job.findByPk(req.params.id)
  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Job not found' })
  }
  res.json(job)
})


module.exports = router