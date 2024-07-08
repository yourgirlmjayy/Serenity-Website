require('dotenv').config()
const{ PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cookieParser = require('cookie-parser')

const PORT = 8080

const cors = require('cors');
const userRoutes = require('./Routes/userRoutes.js');
const populateDatabase = require('./populateDatabase.js');


const express = require('express');
const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(userRoutes);

const populateDB = process.env.POPULATE_DB;

if(populateDB) {
  populateDatabase().catch((e) => {
    console.error(e);
  })
}

// GET requests for /users -> All users
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })