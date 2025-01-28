import express from 'express'
import connectDB from './config/connectDB.js'
import userRouter from './controllers/user.controller.js'
import authMiddleware from './middlewares/auth.js'
import cookieParser from 'cookie-parser'
import itemRouter from './controllers/item.controller.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/api', userRouter)
app.use('/api/items', itemRouter)

app.get('/test', authMiddleware, (req, res) => {
    res.send("Test Route")
})

connectDB()
    .then(() => {
        console.log("Database Connection Established.")
        app.listen(3000, () => console.log("Server Running on PORT 3000"))
    })
    .catch(() => {
        console.log("Database could not be connected")
    })