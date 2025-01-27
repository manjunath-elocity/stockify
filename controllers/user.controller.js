import express from 'express'
import userService from '../services/user.service.js'
import { validateLogin, validateRegister } from '../middlewares/user.validation.js'

const userRouter = express.Router()

userRouter.post('/register', validateRegister, async (req, res,) => {
    try {
        const user = req.body
        const newUser = await userService.registerUser(user)
        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            user: newUser
        })
    } catch (error) {
        if(error.code) {
            return res.status(error.code).json({ success: false, message: error.message })
        }
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

userRouter.post('/login', validateLogin, async (req, res) => {
    try {
        const { emailId, password } = req.body
        const token = await userService.loginUser(emailId, password)
        res.cookie("token", token, { expires: new Date(Date.now() + 60 * 60 * 1000), httpOnly: true, secure: true })
        res.status(200).json({ success: true, message: 'Login successful' })
    } catch (error) {
        if(error.code) {
            return res.status(error.code).json({ success: false, message: error.message })
        }
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})
    

export default userRouter