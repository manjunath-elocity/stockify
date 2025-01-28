import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateToken = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed: No token provided',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id); 

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Authentication failed: User not found',
            });
        }
        
        req.user = {
            _id: user._id,
            emailId: user.emailId,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed: Token has expired',
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed: Invalid token',
            });
        }

        // General error response
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

export default authenticateToken;