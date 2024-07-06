const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
require('dotenv').config()

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const saltRounds = 10;

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



  // Definition of the routes for user registration, logging in in and logging out
  // User Registration/Sign Up
  router.post("/create", async (req, res) => {
    const { email, password} = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Please fill out all fields' });
    }
  
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findFirst({
        where: { email }
      });
      //  check if user already exists
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create a new user in the database using Prisma
       const newUser = await prisma.user.create({
        data: {email, password: hashedPassword}
      });
      // Return a successful response
      res.status(201).json({user: newUser});
    } catch (error) {
      console.error(error);
  
      // Return a 400 error response if email is taken
      if (error.code === "P2002" && error.meta.target.includes("email")) {
        res.status(409).json({ error: "User already exists" });
      } 
      else {
        //return 500 error in worst case scenario
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });
  
  router.post("/login", async (req, res) => {
    
    // get email and password from frontend client
    const {email, password} = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Please fill out all fields' });
  }
    try{
    // use Prisma to find a unique user record in the database where the email matches
      const user = await prisma.user.findUnique({
          where : { email }
      });
    
      if (!user){
        return res.status(404).json({error: "User not found"})
      }
    
      // Compare the provided password with the stored hashed password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password)
    
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    
      const token = jwt.sign({id: user.id, email: user.email}, SECRET_KEY, {expiresIn: '1h'})
      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 3600000,
      });

      res.status(200).json({message:'Login Successsful', user})
  }  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Login failed' });
  }
})

//Get current user
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
});


// Logout Route
router.post('/logout', (req, res) => {
  // clear cookies
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});


//Log mood router
router.post('/moodlog', authenticateToken, async (req, res) => {
    
  // Extract the mood and date from the request body
  const {mood, date} = req.body;
  
 // extract user id from the token
  const userId = req.user.id;
  if(!userId){
      return res.status(400).json({error: 'User ID not found'});
  }

  try {
      const newMood = await prisma.mood.create ({
          data: {
              // Set the mood, date, and user ID for the new entry
              mood,
              date: new Date(date),
              userId
          }
      });
      res.status(201).json(newMood);
  } catch (error) {
      console.error(error)
      res.status(500).json({error: 'Failed to log mood'});}
  }
)

module.exports = router;
  