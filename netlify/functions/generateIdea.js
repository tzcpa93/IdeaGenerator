// netlify/functions/generateIdea.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    // We will use an environment variable for the API key: process.env.OPENAI_API_KEY
    const apiKey = process.env.OPENAI_API_KEY;

    // You can tweak this prompt however you want:
    const prompt = "Give me a funny, ridiculous, and silly startup idea in one short paragraph.";

    // If you want to use ChatGPT (gpt-3.5-turbo), you might call /v1/chat/completions
    // This example uses a 'text-davinci-003' style. Let's keep it simple.
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 60,
        temperature: 0.9,
      }),
    });

    const data = await response.json();
    
    // Extract the generated text
    const idea = data?.choices?.[0]?.text?.trim() || "No idea generated.";

    return {
      statusCode: 200,
      body: JSON.stringify({ idea }),
    };
  } catch (error) {
    console.error('Error generating idea:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate idea' }),
    };
  }
};
