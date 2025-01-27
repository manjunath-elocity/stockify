import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerUser = async (user) => {
    const { firstName, lastName = '', emailId, password } = user
    const existingUser = await User.findOne({ emailId })
    if (existingUser) {
        const error = new Error('User already exists')
        console.log(error)
        error.code = 409
        throw error
    }
    
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({ firstName, lastName, emailId, password: passwordHash })
    await newUser.save()
    return newUser
}

const loginUser = async (emailId, password) => {
    const user = await User.findOne({ emailId })
    if (!user) {
        throw new Error('Invalid email or password')
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch) {
        throw new Error('Invalid email or password')
    }

    const token = jwt.sign(
        { id: user._id, emailId }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h', httpOnly: true, secure: true}
    )

    return token
}

export default { registerUser, loginUser }