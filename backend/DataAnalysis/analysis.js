const calculateMoodFrequency = (moods) => {
    return moods.reduce((accumulator, mood) => {
        accumulator[mood] = (accumulator[mood] || 0) + 1;
        return accumulator;
        //['happy', 'sad', 'happy', 'sad', 'neutral'] --> {happy: 2, sad: 2, neutral: 1}
    }, {});
};

const categorizeMood = (mood) => {
    // Define arrays of positive and negative mood types
    const positiveMoods = ['happy', 'excited'];
    const negativeMoods = ['sad', 'angry'];

    // check what category the mood is
    if (positiveMoods.includes(mood))
        // return positive if the mood is in the positiveMoods array
        return 'positive';

    if (negativeMoods.includes(mood))
        // return negative if the mood is in the negativeMoodsArray 
        return 'negative';

    // return neutral if the mood is neither positive nor negative
    return 'neutral';
}

// function to calculate interQuartile range(IQR)
const calculateIQR = (values) => {
    // Sort the values in ascending order
    values.sort((a, b) => a - b);

    // Calculate the First Quartile (Q1)
    const Q1 = values[Math.floor((values.length / 4))];

    // Calculate the Third Quartile (Q3)
    const Q3 = values[Math.ceil(values.length * (3 / 4)) - 1];

    // Calculate the Interquartile Range (IQR) by subtracting Q1 from Q3
    const IQR = Q3 - Q1;

    return IQR;
}

const identifyMoodTrends = (moods) => {
    // define array to store mood trends
    const trends = [];

    // define array to store outliers
    const outliers = [];

    // define array that keeps track of current trend of moods
    let currentTrend = [];

    // keeps track of the previous mood category
    let previousCategory = null;

    // Step 1: Identify the trends in mood categories

    moods.forEach((mood, index) => {
        // get the category of the current mood
        const currentCategory = categorizeMood(mood);

        if (previousCategory === null || currentCategory === previousCategory) {
            // Initialize a new trend or add to the current one if the category matches
            currentTrend.push(mood);
        } else {
            // End the current trend and start a new one 
            trends.push(currentTrend);
            // start a new trend
            currentTrend = [mood];
        };

        // Handle the last trend 
        if (index === moods.length - 1) {
            trends.push(currentTrend);
        }
        // update the previous category
        previousCategory = currentCategory;
    });

    //step 2: categorize moods and calculate category counts across all trends

    // create an object to store the category of each mood
    const moodCategories = trends.flatMap(trend => trend.map(mood => categorizeMood(mood)));

    // calculate the occurence of each category across the trends
    const categoryCounts = moodCategories.reduce((accumulator, category) => {
        accumulator[category] = (accumulator[category] || 0) + 1;
        return accumulator;
    }, {});


    const dominantCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);

    // calculate the iqr of all the trends based on the category counts
    const iqr = calculateIQR(Object.values(categoryCounts));

    // Step 3: identify outliers based on overall mood category counts

    trends.forEach(trend => {
        const trendCategories = trend.map(mood => categorizeMood(mood));
        const trendCategoryCounts = trendCategories.reduce((accumulator, category) => {
            accumulator[category] = (accumulator[category] || 0) + 1;
            return accumulator;
        }, {});
        trend.forEach(mood => {
            const moodCategory = categorizeMood(mood);
            if (moodCategory !== dominantCategory && trendCategoryCounts[moodCategory] <= iqr) {
                outliers.push(mood);
            }
        })
    });

    // return the trends and outliers
    return { trends, outliers };

};

const calculateActivityFrequency = (activities) => {
    // create object to store each activity and how often it occurs
    const activityCount = {};

    // for ecah activity, check if it already exists
    activities.forEach(activity => {
        // if it exists, increase its value by 1
        // initialize its value to one if it doesn't exist
        activityCount[activity] = (activityCount[activity] || 0) + 1;
    });
    return activityCount;
}


const calculateActivityAndMoodCorrelations = (entries) => {
    // Initialize an object to store correlations
    const correlations = {};

    // loop through every entry to gather mood data for each activity
    entries.forEach(entry => {
        entry.activities.forEach(activity => {
            const activityOption = activity.activityOption.option;

            // Initialize correlation entry if it does not exist
            if (!correlations[activityOption]) {
                correlations[activityOption] = { moods: [] };
            }

            // Collect each mood associated with the activity
            entry.moods.forEach(mood => {
                correlations[activityOption].moods.push(mood.mood);
            });
        });
    });
    // ananlyze each activity in the activity's mood data to find outliers
    for (const activity in correlations) {
        const moodData = correlations[activity].moods;

        // group every mood by their categories
        const moodCategories = moodData.map(mood => categorizeMood(mood));

        // Calculate the count of each category
        const categoryCounts = moodCategories.reduce((accumulator, category) => {
            accumulator[category] = (accumulator[category] || 0) + 1;
            return accumulator
        }, {});

        // determine the dominant mood category
        const dominantCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);

        // calculate the iqr for mood counts
        const iqr = calculateIQR(Object.values(categoryCounts));


        // identify outliers based on mood category and IQR
        const outliers = moodData.filter(mood => {
            const moodCategory = categorizeMood(mood);
            return (moodCategory !== dominantCategory && categoryCounts[moodCategory] <= iqr);
        });
        // add the identified outliers to the correlations array
        correlations[activity].outliers = outliers;
    }
    return correlations;
};


const analyzeUserData = (entries) => {
    //extract all moods from entries and flatten the array of arrays
    const moods = entries.map(entry => entry.moods.map(mood => mood.mood)).flat();

    // extract all activities from the entries and flatten the array of arrays
    const activities = entries.map(entry => entry.activities.map(activity => activity.activityOption.option)).flat();

    // use helper function to calculate the occurence of each mood
    const moodFrequency = calculateMoodFrequency(moods);

    // use helper function to calculate how frequently an activity occurs
    const activityFrequency = calculateActivityFrequency(activities);

    // use helper function to identify the trends of user's mood over a couple of days and determine the oulier
    const moodTrends = identifyMoodTrends(moods);

    // determine correlation between activities and moods
    const activityAndMoodCorrelations = calculateActivityAndMoodCorrelations(entries);

    // return object of all calculated metrics
    return { moodFrequency, activityFrequency, moodTrends, activityAndMoodCorrelations };
};

module.exports = { analyzeUserData, categorizeMood };