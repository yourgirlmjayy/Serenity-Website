const { categorizeMood } = require("../DataAnalysis/analysis");

const isNegativeActivity = (activityOption, associatedMoods, category, activityOptionsForDay) => {
    const predefinedNegativeActivities = ['Sweets', 'Fast Food', 'No sleep', 'Bad sleep'];

    // Check if the user has selected any exercise options
    const hasExerciseOption = activityOptionsForDay.some(option => option.category === 'Exercise');
    // If the user hasn't selected any exercise options, return true
    if (!hasExerciseOption) {
        return true;
    };

    if (predefinedNegativeActivities.includes(activityOption)) {
        return true;
    }


    // check the dominant mood category associated with the activity
    const moodCounts = associatedMoods.reduce((counts, mood) => {
        const category = categorizeMood(mood);
        counts[category] = (counts[category] || 0) + 1;
        return counts;
    }, {});

    //Determine if the dominant mood is negative
    const dominantMoodCategory = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
    return dominantMoodCategory === 'negative';
};

module.exports = { isNegativeActivity };
