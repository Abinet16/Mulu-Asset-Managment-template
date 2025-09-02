// middleware/auth.js - DEBUG VERSION
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  console.log('=== AUTH MIDDLEWARE DEBUG ===');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Cookies:', req.cookies);
  console.log('Authorization header:', req.headers.authorization);
  console.log('Query params:', req.query);
  console.log('============================');
  
  // Try to get token from different sources
  let token = null;
  
  // 1. Check cookies
  if (req.cookies && req.cookies.Authtoken) {
    token = req.cookies.Authtoken;
    console.log('Token found in cookies:', token.substring(0, 20) + '...');
  }
  // 2. Check Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7);
    console.log('Token found in authorization header:', token.substring(0, 20) + '...');
  }
  // 3. Check query parameter
  else if (req.query && req.query.token) {
    token = req.query.token;
    console.log('Token found in query parameter:', token.substring(0, 20) + '...');
  }
  
  if (!token) {
    console.log('❌ No token found in any location');
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  
  try {
    // Use the actual environment variable, not a string
    console.log('JWT Secret from env:', process.env.JWT_SECRET ? 'Present' : 'Missing');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token successfully decoded:', decoded);
    
    // Attach user information to the request
    req.user = {
      userType: decoded.userType,
      userId: decoded.userId,
      userEmail: decoded.userEmail
    };
    
    next();
  } catch (error) {
    console.error("❌ Token verification error:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    res.status(401).json({ error: "Token verification failed" });
  }
}

module.exports = verifyToken;