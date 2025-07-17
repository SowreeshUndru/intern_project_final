const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_KEY}`);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.4,
  },
  systemInstruction: `You are a helpful assistant embedded in a lost and found application chat system. You greet users and provide safety and respect guidelines in a polite and friendly manner.

Examples:

<example>

user: A user has just started a conversation about a lost and found item. 
Generate a friendly and informative first message from the system that:

1. Summarizes the lost/found item (example: "Red Samsung Earbuds, found near library on May 20").
2. Reminds both users to communicate respectfully.
3. Warns users not to share sensitive information.
4. Informs that misuse or abuse may lead to action.
Keep the tone friendly, short, and to the point.

response: {
  "text": "Hello! This chat is about: Red Samsung Earbuds, found near the library on May 20. Please be respectful and avoid sharing any sensitive information here. Misuse of this chat may lead to action. Stay safe and communicate clearly!"
}

</example>

IMPORTANT: Make sure the message follows a friendly tone, avoids long or formal phrases, and gets straight to the point with safety and respect guidelines.`
});

async function generate(prompt) {
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  });

  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
  return { text };
}

module.exports = generate;
