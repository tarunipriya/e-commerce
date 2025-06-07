// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware to protect routes with JWT authentication
const authMiddleware = (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader); // Debug log

  // If the Authorization header is missing or doesn't start with "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
    console.log('Decoded token:', decoded);


    // Attach the decoded payload (user data) to the request object for later use in routes
    req.user = decoded;

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message); // Log error for debugging
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
