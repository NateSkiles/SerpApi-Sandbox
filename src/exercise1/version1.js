// Version 1: Using direct GET requests and parsing the JSON
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const version1 = async (name) => {
  try {
    const apiKey = process.env.SERP_API_KEY; // Access API key from environment variables
    const response = await fetch(
      `https://serpapi.com/search.json?api_key=${apiKey}&q=${encodeURIComponent(name)}+date+of+birth&hl=en`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const dateOfBirth = data.answer_box?.answer;

    if (!dateOfBirth) {
      return console.log(`Date of birth not found for ${name}`);
    }
    console.log(`${name} was born on ${dateOfBirth}`); // Adjust this to log specific data you're interested in
  } catch (error) {
    console.error("Error fetching date of birth:", error.message);
  }
};

export default version1;
