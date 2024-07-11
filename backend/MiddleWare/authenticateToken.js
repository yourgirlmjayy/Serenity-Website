require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY

// Middleware function to authenticate a user using a JSON Web Token (JWT)
const authenticateToken = (req, res, next) => {
    // Retrieve the token from the cookies sent with the request
      const token = req.cookies.token;
      // If no token is found, return a 401 Unauthorized response
      if (!token) {
        return res.sendStatus(401);
      }
    
      // Verify the token using the jwt package and a secret key
      jwt.verify(token, SECRET_KEY, (err, user) => {
        // If the token is invalid or expired, return a 403 Forbidden response
        if (err) {
          return res.sendStatus(403);
        }
        // Assign the decoded user data to the req.user property
        req.user = user;
        next();
      });
    };

module.exports = authenticateToken;
  