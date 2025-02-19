// netlify/functions/generateIdea.js
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  try {
    // Reference the secret API key stored in Netlify's environment variables.
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable");
    }

    // New prompt for generating absurd, satirical accounting app ideas.
    const prompt = `Generate absurd ideas for accounting apps, mocking the surge of AI accounting apps created by individuals who have no experience in accounting. For each, you should generate a name and then a brief description. Your humor should be post-ironic and satirical.`;

    // Call the OpenAI API (using text-davinci-003 as an example).
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "text-davinci-003", // You can change this to "gpt-3.5-turbo" if desired.
        prompt: prompt,
        max_tokens: 150,         // Adjust token count as needed.
        temperature: 0.9         // This value controls the randomness.
      })
    });

    const data = await response.json();

    // Extract the idea from the response.
    const idea =
      data.choices && data.choices[0].text
        ? data.choices[0].text.trim()
        : "No idea generated.";

    return {
      statusCode: 200,
      body: JSON.stringify({ idea: idea }),
    };
  } catch (error) {
    console.error("Error generating idea:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate idea" }),
    };
  }
};
