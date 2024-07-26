const predictUserMoodCategory = require('./PredictUsersMood');
const { fetchStoredLocation, fetchUserActivity, fetchUserMoods } = require('../ActivitiesAnalysis/fetchUserData');
const { determineWeatherCondition, weatherConditions, weatherBuckets, categorizeWeather } = require('../utils/weatherCondition');
const { fetchWeatherDataWithAPI, fetchWeatherDatafromDB } = require('../utils/weatherDetails');
const { RecommendationMap } = require('./RecommendationMaps');
const getUserLocation = require('../utils/Geolocation');
const { categorizeMood } = require('../DataAnalysis/analysis');

const normalizeDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
};

// Generate Recommendations Function 
const generateRecommendations = async (userId, currentDate) => {
    const normalizedCurrentDate = normalizeDate(currentDate);
    // get the user's predicted mood category
    const predictedMoodCategory = await predictUserMoodCategory(userId, currentDate);
    // fetch the user's activities
    const userActivities = await fetchUserActivity(userId);
    // fetch the user's moods
    const userMoods = await fetchUserMoods(userId);

    let weatherData = {};
    // fetch stored location from database
    const storedLocation = await fetchStoredLocation(userId);

    // use stored location or current location of user
    if (storedLocation) {
        // get weather details for current date
        weatherData[normalizedCurrentDate] = await fetchWeatherDataWithAPI(storedLocation.latitude, storedLocation.longitude);
    } else {
        const location = await getUserLocation();
        weatherData[normalizedCurrentDate] = await fetchWeatherDataWithAPI(location.latitude, location.longitude);
    }

    // fall back to database if geolocation or stored location fails
    if (!weatherData[normalizedCurrentDate]) {
        // use weather data from database if the user does not share location
        weatherData = await fetchWeatherDatafromDB(userId);
        if (!weatherData[normalizedCurrentDate]) {
            // set default weather condition if no weather data exists
            weatherData[currentDate] = { condition: 'Sunny' };
        }
    }

    const currentWeatherCondition = categorizeWeather(weatherData[normalizedCurrentDate].condition);
    // create empty array to store user's recommendations based on data 
    const recommendations = [];

    // map moods to activities 
    const moodActivityMap = {};
    userMoods.forEach(({ date, moods }) => {
        const categorizedMoods = moods.map(mood => categorizeMood(mood));
        if (categorizedMoods.includes(predictedMoodCategory)) {
            if (!moodActivityMap[predictedMoodCategory]) {
                moodActivityMap[predictedMoodCategory] = [];
            }
            if (userActivities[date]) {
                moodActivityMap[predictedMoodCategory].push(...userActivities[date]);
            }
        }
    });

    // get historical data associated with predicted mood category
    const historicalActivities = moodActivityMap[predictedMoodCategory] || [];

    // iterate over historical activities associated with predicted mood
    historicalActivities.forEach(activity => {
        if (RecommendationMap[activity]) {
            const moodRecommendations = RecommendationMap[activity][predictedMoodCategory];
            if (moodRecommendations) {
                const weatherRecommendations = moodRecommendations[currentWeatherCondition];
                if (weatherRecommendations) {
                    // pick random similar activity from recommendations map
                    const randomIndex = Math.floor(Math.random() * weatherRecommendations.length);
                    recommendations.push(weatherRecommendations[randomIndex]);
                }
            }
        }
    });

    if (recommendations.length === 0) {
        // return various recommendations based on weather and default mood category if no suitable recommendations were found for the user
        Object.keys(RecommendationMap).forEach(activity => {
            const defaultRecommendations = RecommendationMap[activity]['neutral'][currentWeatherCondition];
            const randomIndex = Math.floor(Math.random() * defaultRecommendations.length);
            recommendations.push(defaultRecommendations[randomIndex]);
        });
    };
    return recommendations;
};

module.exports = { generateRecommendations };