/**
 * Make a script that suggests a spelling fix to any word misspelled using Google "did you mean?" results through our API
 */

import dotenv from "dotenv";
import { getJson } from "serpapi";
import { getInput } from "../utils/index.js";
dotenv.config();

const suggestSpelling = async (word) => {
  try {
    const apiKey = process.env.SERP_API_KEY;
    const data = await getJson({
      api_key: apiKey,
      q: word,
      hl: "en",
      gl: "us",
    });

    const suggestion = data.search_information?.spelling_fix;

    if (!suggestion) {
      return console.log(`No spelling suggestion found for ${word}`);
    }
    console.log(`Did you mean: ${suggestion}`);
  } catch (error) {
    console.error("Error fetching spelling suggestion:", error.message);
  }
};

getInput("Please enter a misspelled word: ", suggestSpelling);
