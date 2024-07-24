const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const router = express.Router();


const fetchWeatherDatafromDB = async (userId) => {
    try {
        // find activity options in the database with the category weather
        const weatherData = await prisma.userEntry.findMany({
            where: {
                userId: userId,
                date: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                }
            },
            include: {
                activities: {
                    include: {
                        activityOption: true
                    },
                    where: {
                        activityOption: {
                            category: { category: 'Weather' }
                        },
                    }
                }
            }
        });


        // return empty array if weather data is not found
        if (!weatherData.length) {
            return [];
        }
        // create an object with the date and weather recorded  for the day
        const processedWeatherData = weatherData.map(entry => ({
            date: entry.date,
            weather: entry.activities.map(activity => activity.activityOption.option),
        }));
        return processedWeatherData;

    } catch (error) {
        console.error('Error fetching weather data:', error);
        return [];
    }
};

const fetchWeatherDataWithAPI = async (latitude, longitude, date = null) => {
    const apiKey = process.env.WEATHER_API_KEY;
    const baseUrl = 'http://api.weatherapi.com/v1';

    try {
        let url;
        if (date) {
            url = `${baseUrl}/history.json?key=${apiKey}&q=${latitude},${longitude}&dt${date}`;
        } else {
            url = `${baseUrl}/current.json?key=${apiKey}&q=${latitude},${longitude}`;
        }
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data', error);
        return null;
    }
}

module.exports = { fetchWeatherDatafromDB, fetchWeatherDataWithAPI };