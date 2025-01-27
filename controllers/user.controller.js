import express from 'express'
import validateUser from '../middlewares/user.validation.js'
import userService from '../services/user.service.js'

const userRouter = express.Router()

userRouter.post('/register', validateUser.validateRegister, async (req, res,) => {
    try {
        const user = req.body
        const newUser = await userService.registerUser(user)
        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            user: {id: newUser.id, emailId: newUser.emailId, firstName: newUser.firstName, lastName: newUser.lastName }
        })
    } catch (error) {
        console.log(error)
        if(error.code) {
            return res.status(error.code).json({ success: false, message: error.message })
        }
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

userRouter.post('/login', validateUser.validateLogin, async (req, res) => {
    try {
        const { emailId, password } = req.body
        const token = await userService.loginUser(emailId, password)
        res.status(200).json({ message: 'Login successful', token })
    } catch (error) {
        res.status(401).json({ message: 'Invalid email or password' })
    }
})
    

export default userRouter