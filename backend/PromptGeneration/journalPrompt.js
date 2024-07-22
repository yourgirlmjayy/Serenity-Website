const fetch = require('node-fetch');

require('dotenv').config();

const { generateJournalPromptWithGemini } = require('../utils/Gemini');


const calculateFeedbackScore = (prompt, feedbackData, promptHistory) => {
    // calculate explicit feedback scores
    const explicitScore = (feedbackData[prompt]?.upvotes || 0) - (feedbackData[prompt]?.downvotes || 0);

    // caluclate implicit feedback scores
    const implicitDownVotes = (promptHistory[prompt]?.views || 0) - (promptHistory[prompt]?.responses || 0);

    // Consider implicit downvotes only if they are positive
    const totalImplicitDownVotes = implicitDownVotes > 0 ? implicitDownVotes : 0;

    // Calculate total score, considering implicit feedback as half as significant as explicit feedback
    const totalScore = explicitScore - (totalImplicitDownVotes * 0.5);

    return totalScore;
};


const adjustPromptUsage = (feedbackScores) => {
    const adjustedFrequencies = {};
    for (const prompt in feedbackScores) {
        const score = feedbackScores[prompt];

        // Threshold above which we increase the usage of the prompt
        const increaseThreshold = 2;

        // Threshold below which we decrease the usage of the prompt
        const decreaseThreshold = -2;

        if (score >= increaseThreshold) {
            adjustedFrequencies[prompt] = 'increase';
        } else if (score <= decreaseThreshold) {
            adjustedFrequencies[prompt] = 'decrease';
        } else {
            adjustedFrequencies[prompt] = 'maintain';
        }
    }
    return adjustedFrequencies;
};


// helper function to check if a prompt should be used based on user feedback
const shouldUsePrompt = (prompt, feedbackScores, adjustedFrequencies) => {
    // Check if the prompt has an adjusted frequency decision available
    if (adjustedFrequencies[prompt]) {
        // Use the prompt if the frequency adjustment is to 'increase' or 'maintain'
        return adjustedFrequencies[prompt] === 'increase' || adjustedFrequencies[prompt] === 'maintain';
    }
    // If no adjusted frequency is available, fall back to checking the feedback score directly
    const scoreThreshold = 0; // Define a threshold for using the prompt based on score
    const score = feedbackScores[prompt] || 0;
    return score >= scoreThreshold;
};

// Helper function to create a unique list of moods or activities
const createUniqueList = (items) => {
    return [...new Set(items)];
};

// Helper function to generate a prompt based on moods or activities
const generatePrompt = (description, items) => {
    const uniqueItems = createUniqueList(items);
    const itemList = uniqueItems.join(', ');
    return `You've been experiencing ${description}: ${itemList}. Do you want to talk about this?`;
};

// Define rules for prompt generation
const rules = [
    {
        // Check for outliers in mood trends and activity mood correlations
        condition: (analysis) => {
            return analysis &&
                analysis.moodTrends &&
                analysis.moodTrends.outliers &&
                analysis.moodTrends.outliers.length > 0 &&
                analysis.activityMoodCorrelations &&
                Object.values(analysis.activityMoodCorrelations).some(activity => activity && activity.outliers && activity.outliers.length > 0);
        },
        action: (analysis) => {
            const moodOutliers = createUniqueList(analysis.moodTrends.outliers);
            const activityOutliers = analysis.activityMoodCorrelations ?
                Object.entries(analysis.activityMoodCorrelations).flatMap(([activity, data]) => {
                    return data && data.outliers ? data.outliers.map(outlier => `${outlier} during ${activity}`) : [];
                }) : [];
            const allOutliers = [...moodOutliers, ...activityOutliers];
            return generatePrompt("a mix of unusual moods and feelings during activities", allOutliers);
        }
    },
    {
        // Check for outliers in mood trends
        condition: (analysis) => {
            return analysis &&
                analysis.moodTrends &&
                analysis.moodTrends.outliers &&
                analysis.moodTrends.outliers.length > 0;
        },
        action: (analysis) => {
            const moodOutliers = createUniqueList(analysis.moodTrends.outliers);
            const description = moodOutliers.length > 1 ? "a variety of moods" : "a specific mood";
            return generatePrompt(description, moodOutliers);
        }
    },

    {
        // Check for general activity mood correlations for outliers
        condition: (analysis) => {
            // Check if analysis is properly structured and contains the necessary data
            return analysis && analysis.activityMoodCorrelations &&
                Object.values(analysis.activityMoodCorrelations).some(activity => activity && activity.outliers && activity.outliers.length > 0);
        },
        action: (analysis) => {
            // Assuming the condition is met, we proceed with confidence that the data exists
            const activityOutliers = Object.entries(analysis.activityMoodCorrelations).flatMap(([activity, data]) => {
                return data && data.outliers ? data.outliers.map(outlier => `${outlier} during ${activity}`) : [];
            });
            // Generate a prompt based on the outliers found
            return generatePrompt('unusual feelings during activities', activityOutliers);
        }
    },


    {
        // Default prompt if no specific trend or correlation is found
        condition: (analysis) => true,
        action: (analysis) => {
            // Define the default action implementation
            const moodTrends = analysis.moodTrends.trends;
            if (moodTrends.length > 0) {
                const moodsArray = moodTrends.flat();
                if (moodsArray && moodsArray.length > 0) {
                    const lastMood = moodsArray[moodsArray.length - 1];
                    return `It seems like you're feeling ${lastMood}. Do you want to share why you feel this way?`;
                }
            }
            return 'How are you feeling today?';
        }
    }
];

const createInitialPrompt = (analysis, feedbackData, promptHistory) => {
    // Iterate over all but the last rule
    for (let i = 0; i < rules.length - 1; i++) {
        let rule = rules[i];
        if (rule.condition(analysis)) {
            const prompt = rule.action(analysis);

            // Return immediately for any specific rule that matches
            if (shouldUsePrompt(prompt, feedbackData, promptHistory)) {
                return prompt;
            }
        }
    }
    // Handle the default rule
    const defaultRule = rules[rules.length - 1];
    if (defaultRule.condition(analysis)) {
        // Return the default prompt
        return defaultRule.action(analysis);
    }
};

const generateJournalPromptWithFeedback = async (analysis, feedbackData, promptHistory, apiKey) => {
    const feedbackScores = {};
    const promptActions = {};
    let selectedPrompt = null;
    let adjustedFrequencies = {};

    // Iterate over rules to find a suitable prompt based on conditions
    for (const rule of rules) {
        if (rule.condition(analysis)) {  // Check if the condition for this rule is met
            const prompt = rule.action(analysis);

            // Store action to avoid re-calculation
            promptActions[prompt] = rule.action;

            // Calculate and store the feedback score for each prompt based on feedback data and historical prompt usage.
            feedbackScores[prompt] = calculateFeedbackScore(prompt, feedbackData, promptHistory);

            // Determine feedback from user and select the appropriate prompt
            adjustedFrequencies = adjustPromptUsage(feedbackScores);
            if (adjustedFrequencies[prompt] === 'increase' || adjustedFrequencies[prompt] === 'maintain') {
                selectedPrompt = prompt;
                break;  // Break out of the loop once a suitable prompt has been found
            }
        }
    }

    // If no suitable prompt was found in the loop, use a default or initial prompt
    if (!selectedPrompt) {
        selectedPrompt = createInitialPrompt(analysis, feedbackData, promptHistory);
        adjustedFrequencies = adjustPromptUsage(feedbackScores);
    }

    // Determine the tone based on the frequency adjustment
    const tone = adjustedFrequencies[selectedPrompt] === 'decrease' ? 'supportive' :
        adjustedFrequencies[selectedPrompt] === 'increase' ? 'compassionate' : 'therapeutic';

    // Get refined prompt from Gemini
    const refinedPrompt = await generateJournalPromptWithGemini(selectedPrompt, tone, apiKey);
    if (refinedPrompt) {
        // Return an object of the initial prompt and the refined prompt
        return { initialPrompt: selectedPrompt, refinedPrompt };
    } else {
        // If there is no suggested prompt from Gemini, use the unrefined prompt
        return { initialPrompt: selectedPrompt, refinedPrompt: selectedPrompt };
    }
}

module.exports = { createInitialPrompt, shouldUsePrompt, generateJournalPromptWithFeedback, calculateFeedbackScore, adjustPromptUsage };
