import express from 'express'
import connectDB from './config/connectDB.js'
import userRouter from './controllers/user.controller.js'
import cookieParser from 'cookie-parser'
import itemRouter from './controllers/item.controller.js'

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express()
app.use(express.json())
app.use(cookieParser())

// Swagger Documentation 
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use('/api', userRouter)
app.use('/api/items', itemRouter)

const PORT = process.env.PORT || 3000

connectDB()
    .then(() => {
        console.log("Database Connection Established.")
        app.listen(PORT, () => console.log("Server Running on PORT 3000"))
    })
    .catch(() => {
        console.log("Database could not be connected")
    })