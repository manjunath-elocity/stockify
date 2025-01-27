import express from 'express'
import { validateRegister } from '../middlewares/validation.js'
import { registerUser } from '../services/userServices.js'

const userRouter = express.Router()

userRouter.post('/register', validateRegister, async (req, res,) => {
    try {
        const user = req.body
        const newUser = await registerUser(user)
        res.status(201).json({ message: 'User Registered', user: newUser })
    } catch (error) {
        if(error.code === 11000) {
            return res.status(400).json({ message: 'User already exists' })
        }
        res.status(500).json({ message: 'Internal server error' })
    }
})
    

export default userRouter