// Define an object to map weather conditions to their corresponding temperature ranges
const weatherConditions = {
    // Hot: above 85°F
    Hot: { minTemp: 85 },
    // Warm: between 65°F and 84°F
    Warm: { minTemp: 65, maxTemp: 84 },
    // Cool: between 45°F and 64°F
    Cool: { minTemp: 45, maxTemp: 64 },
    // Cold: below 44°F
    Cold: { maxTemp: 44 },
};

// Function to determine the weather condition based on temperature
const determineWeatherCondition = (tempF, maxTempF = null, minTempF = null) => {
    let temperature = tempF;

    // Calculate the average temperature if max and min temperatures are provided
    if (maxTempF && minTempF) {
        temperature = (maxTempF + minTempF) / 2;
    }

    // Iterate over the weather conditions to find the matching one
    for (const [condition, range] of Object.entries(weatherConditions)) {
        // Check if the temperature falls within the condition's range
        if ((range.minTemp === undefined || temperature >= range.minTemp) &&
            (range.maxTemp === undefined || temperature <= range.maxTemp)) {
            // Return the matching weather condition
            return condition;
        }
    }
};

const weatherBuckets = {
    sunny: ['Hot', 'Sunny'],
    rainy: ['Warm', 'Cool'],
    cold: ['Cold, Windy']
};

const categorizeWeather = (condition) => {
    for (const [category, conditions] of Object.entries(weatherBuckets)) {
        if (conditions.includes(condition)) {
            return category;
        }
    }
}

module.exports = { weatherConditions, determineWeatherCondition, categorizeWeather, weatherBuckets };

