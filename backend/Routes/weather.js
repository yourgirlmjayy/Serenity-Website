const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../MiddleWare/authenticateToken');
const { fetchWeatherDataWithAPI, fetchWeatherDatafromDB } = require('../utils/weatherDetails');
const { fetchUserActivity } = require('../ActivitiesAnalysis/fetchUserData');

router.post('/get-weather', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;
    let weather;

    try {
        // fetch user data to get stored location
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { latitude: true, longitude: true }
        });
        let lat = latitude;
        let lon = longitude;

        // use provided location if available, otherwise use stored location
        if (user && user.latitude && user.longitude) {
            lat = user.latitude;
            lon = user.longitude;
        }

        else if (latitude && longitude) {
            // update database with location details
            await prisma.user.update({
                where: { id: userId },
                data: { latitude, longitude }
            });
        };
        // Fetch user activity data
        const userEntries = await fetchUserActivity(userId);

        if (lat && lon) {
            if (userEntries.length > 0) {
                // fetch historical weather data for the past seven days if user has entries
                const weatherPromises = userEntries.map(entry => fetchWeatherDataWithAPI(lat, lon, entry.date.toISOString().split('T')[0]));
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