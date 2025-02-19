// netlify/functions/generateIdea.js
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  try {
    // Get your API key from Netlify's environment variables.
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable");
    }

    // Updated prompt:
    // Return exactly two lines of HTML:
    //   1. The first line: only the app's name wrapped in <strong> tags.
    //   2. The second line: begins with <br><br> immediately followed by the app description in plain text.
    // At the end of the description, include one or more emojis (only money 💰, rocket 🚀, or eggplant 🍆).
    const prompt = `Generate one absurd idea for an accounting app, mocking the surge of AI accounting apps created by individuals with no accounting experience. For your output, please return exactly two lines of HTML:
1. The first line should contain only the app's name wrapped in <strong> tags.
2. The second line should begin with <br><br> immediately followed by the app description in plain text (with no additional HTML tags).
At the end of the description, include one or more emojis, choosing only from money (💰), rocket (🚀), or eggplant (🍆).
Do not include any extra text or additional formatting. Your humor should be post-ironic and satirical.`;

    // Call the Chat Completions endpoint using GPT-3.5-turbo.
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a creative and irreverent startup idea generator." },
          { role: "user", content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 150
      })
    });

    const data = await response.json();

    // Log the complete API response for debugging.
    console.log("API response:", JSON.stringify(data));

    // Extract the generated text from the chat response.
    const idea =
      data.choices &&
      data.choices[0].message &&
      data.choices[0].message.content
        ? data.choices[0].message.content.trim()
        : "No idea generated.";

    return {
      statusCode: 200,
      body: JSON.stringify({ idea }),
    };
  } catch (error) {
    console.error("Error generating idea:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate idea" }),
    };
  }
};
