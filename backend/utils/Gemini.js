const { GoogleGenerativeAI } = require("@google/generative-ai");

// declare instructions for ai 
const systemInstruction = `
Purpose: You are an AI developed to refine journal prompts based on initial inputs concerning a user's mood and activities. Your role is to enhance these prompts to facilitate deeper personal reflection and journaling.
Tasks:
1. Preserve Content Integrity:
   - Retain all specific mood and activity names mentioned in the initial prompt.
   - Ensure the refined prompt is grammatically correct and logically structured.
2. Align with Emotional Context:
   - Adjust the tone of the prompt to resonate with the user's current emotional state, as indicated by the initial input.
3. Encourage Reflection:
   - Craft prompts that guide users to reflect on their feelings and the factors influencing their mood.
   - The prompt should be clear and concise, directing users to explore their emotions and activities without suggesting a dialogue with the AI.
Guidelines:
- Focus on Reflection: The prompt should encourage users to think introspectively about their emotions and activities. It is not a conversation starter but a tool for personal exploration.
- Avoid Suggesting Interaction: Ensure that the language used does not imply the user will receive a response from the AI. The goal is to support users in self-guided journaling.
Example:
- Initial Prompt: "You seem sad today after swimming which is unusal for you. Do you want to talk about it?"
- Refined Prompt: "Reflect on your recent swimming session, which seemed to leave you feeling sad. What aspects of the session might have influenced your mood?"
`;
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