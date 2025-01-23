const express = require("express");
const { connectDB } = require("./config/connectDB");

const app = express()

connectDB()
    .then(() => {
        console.log("Database Connection Established.")
        app.listen(3000, () => console.log("Server Running on PORT 3000"))
    })
    .catch(() => {
        console.log("Database could not be connected")
    })