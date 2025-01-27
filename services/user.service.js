import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerUser = async (user) => {
    const { firstName, lastName = '', emailId, password } = user
    const existingUser = await User.findOne({ emailId })
    if (existingUser) {
        throw new Error('User already exists')
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({ firstName, lastName, emailId, password: passwordHash })
    await newUser.save()
    console.log('User Registered')
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