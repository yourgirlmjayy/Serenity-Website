const { GoogleGenerativeAI } = require("@google/generative-ai");

// declare instructions for ai 
const systemInstruction = ` You are an AI designed to refine initial journal prompts for users in a journalling app. 
You will receive an initial prompt that includes the user's mood and sometimes activities. 
Your task is to refine this prompt while maintaining the integrity of the provided information. 
- Maintain the names of the moods and activities in the refined prompt e.g TV, Friends, Alone are all activities. 
- Ensure the prompt is grammatically correct and logical. 
- Use the given tone to align with the user's emotional state. 
- Provide a concise and clear prompt that helps users reflect on their feelings and experiences. 
- Ensure the prompt encourages personal reflection and journaling, without implying that the user will receive a response from the AI. 
- Do not generate the same structure of prompts over and over again
Your task: 
1. Refine the initial prompt you receive, ensuring it includes the mood and activity names. 
2. Make it relevant to the user's current emotions and activities. 
3. Align the prompt with the given tone included in the initial prompt. 
4. Design the prompt to encourage self-reflection and journaling, without suggesting that the user will get a response. 
Guidelines:
- Focus on Reflection: The prompt should encourage users to think introspectively about their emotions and activities. It is not a conversation starter but a tool for personal exploration.
- Avoid Suggesting Interaction: Ensure that the language used does not imply the user will receive a response from the AI. The goal is to support users in self
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
        console.log(prompt);
        return prompt;

    } catch (error) {
        console.error("Error generating journal prompt with Gemini AI:", error);
        return "";
    }
};

module.exports = { generateJournalPromptWithGemini };

