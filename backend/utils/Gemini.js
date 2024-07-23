const { GoogleGenerativeAI } = require("@google/generative-ai");

// declare instructions for ai 
const systemInstruction = "You are an AI designed to generate journal prompts for users based on their emotional states, which are influenced by their activities and mood. Ensure that the mood names and activity names in the initial prompt are included in the refined prompt. Users will not respond to these prompts. Your task is to refine the given initial prompt to make it more personal and relevant to the user's current emotions, and to ensure it aligns with the suggested tone included in the initial prompt. The tone should be woven naturally into the prompt to help the user think deeply about their feelings and experiences without expecting a reply. Your response should be a single, complete sentence crafted to help the user reflect on and better understand their emotions.";
const generateJournalPromptWithGemini = async (initialPrompt, tone, apiKey) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel(
        {
            model: "gemini-1.5-flash",

            // pass in instruction to gemini

            systemInstruction: systemInstruction,
            generationConfig: { responseMimeType: "text/plain" }
        });

    const toneMessage = tone ? `Use a ${tone} tone` : "";

    try {
        const result = await model.generateContent(initialPrompt + toneMessage);
        const response = await result.response;
        const prompt = response.text();
        return prompt;

    } catch (error) {
        console.error("Error generating journal prompt with Gemini AI:", error);
        return "";
    }
};

module.exports = { generateJournalPromptWithGemini };