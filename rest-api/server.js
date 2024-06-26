require('dotenv').config()
const { StatusCodes } = require('http-status-codes')
const cors = require('cors')
const express = require('express')

const userRouter = require('./routes/userRouter')
const experienceRouter = require('./routes/experienceRouter')
const jobRouter = require('./routes/jobRouter')
const applicationRouter = require('./routes/applicationRouter')

const serverPort = process.env.SERVER_PORT || 3000
const clientPort = process.env.CLIENT_PORT || 5173
const app = express()

app.use(express.json())
app.use(cors({
    origin: `http://localhost:${clientPort}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.get('/', (req, res) => {
    res.json({ message: 'Root endpoint' })
})

app.use('/users', userRouter)
app.use('/experiences', experienceRouter)
app.use('/jobs', jobRouter)
app.use('/applications', applicationRouter)

app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Endpoint not found' })
})

app.listen(serverPort, () => console.info(`Express app running at: http://localhost:${serverPort}`))