const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../MiddleWare/authenticateToken');
const { fetchWeatherDataWithAPI, fetchWeatherDatafromDB } = require('../utils/weatherDetails');
const { fetchUserActivity } = require('../ActivitiesAnalysis/fetchUserData');

router.post('/get-weather', authenticateToken, async (req, res) => {
    const { userId } = req.user.id;
    const { latitude, longitude } = req.body;

    try {
        let weather;

        // Fetch user activity data
        const userEntries = await fetchUserActivity(userId);

        if (latitude && longitude) {
            if (userEntries.length > 0) {
                // fetch historical weather data for the past seven days if user has entries
                const weatherPromises = userEntries.map(entry => fetchWeatherDataWithAPI(latitude, longitude, entry.date.toISOString().split('T')[0]));
                weather = await Promise.all(weatherPromises);
            } else {
                // get the current weather data for the day if user does not have entries
                weather = await fetchWeatherDataWithAPI(latitude, longitude);
            }
        } else {
            // Fetch weather data from DB if user does not accept to share location or browser does not support geolocation
            weather = await fetchWeatherDatafromDB(userId);
        }
        // Return the weather data with a 200 status code
        res.status(200).json({ weather });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;