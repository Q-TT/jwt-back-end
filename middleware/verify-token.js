const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Assign decoded payload to req.user
        req.user = decoded;
        // Call next() to invoke the next middleware function
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
  };
  
// We'll need to export this function so that we can use it in our controllers file
module.exports = verifyToken;