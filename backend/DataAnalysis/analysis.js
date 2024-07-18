const calculateMoodFrequency = (moods) => {
    return moods.reduce((accumulator, mood) => {
        accumulator[mood] = (accumulator[mood] || 0) + 1;
        return accumulator;
        //['happy', 'sad', 'happy', 'sad', 'neutral'] --> {happy: 2, sad: 2, neutral: 1}
    }, {});
};

const identifyMoodTrends = (moods) => {
    // array to store identified mood trends
    const trends = [];
    //array to store the current sequence of similar moods
    let currentTrend = [];

    for (let i = 0; i < moods.length; i++) {
        if (currentTrend.length === 0 || currentTrend[currentTrend.length - 1] === moods[i]) {
            // if current trend is empty or the current mood matches the last mood in currentTrend, add it to current trend
            currentTrend.push(moods[i]);
        } else {
            // if current mood is different, push current trends to trends and start a new currentTrend
            trends.push(currentTrend);
            currentTrend = [moods[i]];
        }
    }
    // after the iteration, if currentTrend has any moods left, add it to trends
    if (currentTrend.length > 0) {
        trends.push(currentTrend);
    }

    // return the identified mood trends
    return trends;
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
    // object to store the moods associated with each activity
    const correlations = {};
    entries.forEach(entry => {
        entry.activities.forEach(activity => {
            const activityOption = activity.activityOption.option;
            if (!correlations[activityOption]) {
                // initialize correlation entry if it does not exist
                correlations[activityOption] = { moods: [] };
            }
            // collect each mood associated with that activity
            entry.moods.forEach(mood => {
                correlations[activityOption].moods.push(mood.mood);
            });
        });
    });
    // return the correlation between mood and activities
    return correlations;
}

const detectMoodOutliers = (moods, commonMoods) => {
    // define treshold fr how many occurences count as outliers
    const threshold = 1;
    // moods occuring just once are considered outliers
    const outliers = moods.filter(mood => commonMoods[mood] === threshold);
    return outliers;
}


const analyzeUserData = (entries) => {
    //extract all moods from entries and flatten the array of arrays
    const moods = entries.map(entry => entry.moods.map(mood => mood.mood)).flat();

    // extract all activities from the entries and flatten the array of arrays
    const activities = entries.map(entry => entry.activities.map(activity => activity.activityOption.option)).flat();

    // use helper function to calculate the occurence of each mood
    const moodFrequency = calculateMoodFrequency(moods);

    // use helper function to calculate how frequently an activity occurs
    const activityFrequency = calculateActivityFrequency(activities);

    // determine correlation between activities and moods
    const activityAndMoodCorrelations = calculateActivityAndMoodCorrelations(entries);

    // detect outlier moods based on mood frequency 
    const moodOutliers = detectMoodOutliers(moods, moodFrequency);

    // return object of all calculated metrics
    return { moodFrequency, activityFrequency, activityAndMoodCorrelations, moodOutliers };
};
