// Version 2: Using the official SerpApi library
import dotenv from "dotenv";
import { getJson } from "serpapi";
dotenv.config();

const version2 = async (name) => {
  try {
    const apiKey = process.env.SERP_API_KEY;
    const data = await getJson({
      api_key: apiKey,
      q: `${encodeURIComponent(name)} date of birth`,
      hl: "en",
    });

    const dateOfBirth = data.answer_box?.answer;

    if (!dateOfBirth) {
      return console.log(`Date of birth not found for ${name}`);
    }
    console.log(`${name} was born on ${dateOfBirth}`);
  } catch (error) {
    console.error("Error fetching date of birth:", error.message);
  }
};

export default version2;
