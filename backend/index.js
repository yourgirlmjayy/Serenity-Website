const express = require('express');
const{ PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()
const cors = require('cors');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

const PORT = 8080


app.post("/create", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create a new user in the database using Prisma
    await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        password: hashedPassword
      }
    });
    // Return a successful response
    res.status(200).json({});
  } catch (error) {
    console.error(error);

    // Check if the error is a Prisma validation error
    if (error instanceof prisma.PrismaClientValidationError) {
      res.status(400).json({ error: "Invalid request data" });
    } 
    // Return a 400 error response if email is taken
    else if (error instanceof prisma.PrismaClientKnownRequestError) {
      res.status(409).json({ error: "User already exists" });
    } 
    else {
      //return 500 error in worst case scenario
      res.status(500).json({ error: "Failed to create user" });
    }
  }
});

app.post("/login", async (req, res) => {
  // get email and password from frontend client
  const {email, password} = req.body;
  // use Prisma to find a unique user record in the database where the email matches
  const userRecord = await prisma.user.findUnique({
      where : { email }
  });

  // Compare the provided password with the stored hashed password using bcrypt
  bcrypt.compare(password, userRecord.hashedPassword, function(err, result) {
      if (result) {
          // If passwords match, return a successful response (200 OK)
          res.status(200).json({});
      } else {
          // If passwords don't match or an error occurs, return an error response (500 Internal Server Error)
          res.status(500).json({"error": err});
      }
  });
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })