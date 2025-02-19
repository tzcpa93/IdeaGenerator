// netlify/functions/generateIdea.js
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  try {
    // Get your API key from Netlify's environment variables.
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable");
    }

    // New prompt for generating absurd, satirical accounting app ideas.
    const prompt = `Generate absurd ideas for accounting apps, mocking the surge of AI accounting apps created by individuals who have no experience in accounting. For each, you should generate a name and then a brief description. Your humor should be post-ironic and satirical.`;

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
      data.choices && data.choices[0].message && data.choices[0].message.content
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
