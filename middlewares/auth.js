import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed: No token provided',
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID in the decoded token
        const user = await User.findById(decoded.userId); // Assuming payload uses `userId`

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Authentication failed: User not found',
            });
        }

        // Attach user info to the request
        req.user = {
            _id: user._id,
            emailId: user.emailId,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        // Pass control to the next middleware/route
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

export default authMiddleware;