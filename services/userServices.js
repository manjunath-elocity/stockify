import User from "../models/user.js"
import bcrypt from "bcrypt"

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

export { registerUser }