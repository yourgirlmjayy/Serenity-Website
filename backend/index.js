require('dotenv').config()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cookieParser = require('cookie-parser')

const PORT = 8080

const cors = require('cors');
const userAuthRoutes = require('./Routes/userAuth.js');
const userEntries = require('./Routes/entries.js');
const userFeed = require('./Routes/userFeed.js');
const journalRoutes = require('./Routes/journals.js');
const userProfile = require('./Routes/profile.js');
const pastJournalsRoutes = require('./Routes/allJournals.js');
const weatherRoutes = require('./Routes/weather.js');
const recommendedActivitiesRoutes = require('./Routes/recommendations.js');

const express = require('express');
const { join } = require('@prisma/client/runtime/library');
const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(userAuthRoutes);
app.use(userEntries);
app.use(userFeed);
app.use(journalRoutes);
app.use(userProfile);
app.use(pastJournalsRoutes);
app.use(weatherRoutes);
app.use(recommendedActivitiesRoutes);

// GET requests for /users -> All users
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})