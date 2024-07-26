const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');

const { categorizeMood } = require("../DataAnalysis/analysis");
const { determineWeatherCondition, weatherConditions } = require("../utils/weatherCondition");
const { fetchUserActivity, fetchUserMoods, fetchStoredLocation } = require("../ActivitiesAnalysis/fetchUserData");
const { RecommendationMap } = require("./RecommendationMaps");
const { categorizeWeather, weatherBuckets } = require("../utils/weatherCondition");
const { getDayOfWeek, getTimeOfDay } = require("../utils/dates");
const { fetchWeatherDataWithAPI, fetchWeatherDatafromDB } = require("../utils/weatherDetails");
const getUserLocation = require("../utils/Geolocation");


const aggregateUserMoodData = (userMoods) => {
    const aggregatedMoods = userMoods.reduce((result, { date, moods }) => {
        moods.forEach((mood) => {
            const categorizedMood = categorizeMood(mood);
            if (!result[categorizedMood]) {
                result[categorizedMood] = [];
            }
            result[categorizedMood].push({ date });
        });
        return result;
    }, {});
    return aggregatedMoods;
};

// Analyzes mood trends by day of the week 
const analyzeMoodTrendsByDay = (aggregatedMoods) => {
    const dayOfWeekTrends = {};

    // Loop through each mood in the aggregated mood data.
    for (const mood of Object.keys(aggregatedMoods)) {
        const days = aggregatedMoods[mood].reduce((counts, entry) => {

            // Get the day of the week for the current entry's date.
            const day = getDayOfWeek(new Date(entry.date));

            // Increment the count for the current day of the week.
            counts[day] = (counts[day] || 0) + 1;
            // Return the updated counts object.
            return counts;
        }, {});

        // Store the day of the week trends for the current mood in the dayOfWeekTrends object.
        dayOfWeekTrends[mood] = days;
    }
    return dayOfWeekTrends;
};

/**
 * Analyzes mood trends based on weather conditions.
 * 
 * @param {Object} aggregatedMoods - Aggregated mood data, where each key is a mood and each value is an array of entries.
 * @param {Object} weatherData - Weather data, where each key is a date and each value is the weather condition for that date.
 * @returns {Object} Weather trends for each mood.
 */

const normalizeDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
};

const analyzeMoodTrendsByWeather = (aggregatedMoods, weatherData) => {
    // Initialize an empty object to store weather trends for each mood.
    const weatherTrends = {};

    // Iterate over each mood in the aggregated mood data.
    for (const mood of Object.keys(aggregatedMoods)) {
        const weatherConditions = aggregatedMoods[mood].reduce((counts, entry) => {
            // Get the weather condition for the current entry's date from the weatherData object.
            const date = normalizeDate(entry.date);
            const weatherEntry = weatherData[date];
            if (weatherEntry) {
                const condition = weatherEntry.condition || weatherEntry.weather;
                const weather = categorizeWeather(condition);
                counts[weather] = (counts[weather] || 0) + 1;
            }
            // Increment the count for the current weather condition.
            return counts;
        }, {});
        // Store the weather conditions for the current mood in the weatherTrends object.
        weatherTrends[mood] = weatherConditions;
    }
    // Return the weather trends for each mood.
    return weatherTrends;
};

// Predict User Mood Category Function 
const predictUserMoodCategory = async (userId, currentDate) => {
    const userMoods = await fetchUserMoods(userId);

    const normalizedCurrentDate = normalizeDate(currentDate);

    const storedLocation = await fetchStoredLocation(userId);

    let weatherData = {};

    // fetch historical weather based on past moods
    for (const moodEntry of userMoods) {
        const date = normalizeDate(moodEntry.date);
        if (storedLocation) {
            const historicalWeather = await fetchWeatherDataWithAPI(storedLocation.latitude, storedLocation.longitude, date);
            weatherData[date] = historicalWeather;
        } else {
            const location = await getUserLocation();
            const historicalWeather = await fetchWeatherDataWithAPI(location.latitude, location.longitude, date);
            weatherData[date] = historicalWeather;
        }
    }

    // fetch weather data for current date 
    if (!weatherData[normalizedCurrentDate]) {
        if (storedLocation) {
            weatherData[normalizedCurrentDate] = await fetchWeatherDataWithAPI(storedLocation.latitude, storedLocation.longitude);
        } else {
            const location = await getUserLocation();
            weatherData[normalizedCurrentDate] = await fetchWeatherDataWithAPI(location.latitude, location.longitude);
        }
    }

    if (!weatherData || Object.keys(weatherData).length === 0) {
        weatherData = await fetchWeatherDatafromDB(userId);
        if (!weatherData || Object.keys(weatherData).length === 0) {
            // set default weather condition if no weather data exists
            weatherData[currentDate] = { condition: 'Sunny' };
        }
    }

    const aggregatedMoods = aggregateUserMoodData(userMoods);

    const dayOfWeek = getDayOfWeek(new Date(normalizedCurrentDate));

    // Categorize weather condition
    const weatherCondition = categorizeWeather(weatherData[normalizedCurrentDate]);

    // Analyze mood trends by day and weather
    const dayOfWeekTrends = analyzeMoodTrendsByDay(aggregatedMoods);
    const weatherTrends = analyzeMoodTrendsByWeather(aggregatedMoods, weatherData);

    const predictedMoodByDay = dayOfWeekTrends[dayOfWeek];
    const predictedMoodByWeather = weatherTrends[weatherCondition];

    // Get predicted mood scores for day and weather
    const combinedMoodScores = { ...predictedMoodByDay, ...predictedMoodByWeather };
    if (Object.keys(combinedMoodScores).length === 0) {
        // return default mood if no predictions can be made
        return 'neutral';
    }
    const predictedMoodCategory = Object.keys(combinedMoodScores).reduce((a, b) => (combinedMoodScores[a] > combinedMoodScores[b] ? a : b));

    return predictedMoodCategory;
};

module.exports = predictUserMoodCategory;