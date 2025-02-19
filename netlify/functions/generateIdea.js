// netlify/functions/generateIdea.js

exports.handler = async function (event, context) {
  try {
    // Load the list of ideas from the JSON file.
    // Adjust the relative path if your file is located elsewhere.
    const ideas = require('../../ideas.json');
    
    if (!Array.isArray(ideas) || ideas.length === 0) {
      throw new Error("No ideas available in the JSON file.");
    }
    
    // Randomize: select one idea from the array.
    const randomIndex = Math.floor(Math.random() * ideas.length);
    const chosenIdea = ideas[randomIndex];

    return {
      statusCode: 200,
      body: JSON.stringify({ idea: chosenIdea })
    };
  } catch (error) {
    console.error("Error selecting idea:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to select idea" })
    };
  }
};
