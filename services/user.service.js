import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerUser = async (user) => {
    const { firstName, lastName = '', emailId, password } = user
    const existingUser = await User.findOne({ emailId })
    if (existingUser) {
        const error = new Error('User already exists')
        error.code = 409
        throw error
    }
    
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({ firstName, lastName, emailId, password: passwordHash })
    await newUser.save()

    return { 
        id: newUser._id, 
        emailId: newUser.emailId, 
        firstName: newUser.firstName, 
        lastName: newUser.lastName 
    }
}

const loginUser = async (emailId, password) => {
    const user = await User.findOne({ emailId })
    if (!user) {
        const error = new Error('Invalid email or password')
        error.code = 401
        throw error
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch) {        
        const error = new Error('Invalid email or password')
        error.code = 401
        throw error
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'})

    return token
}

export default { registerUser, loginUser }