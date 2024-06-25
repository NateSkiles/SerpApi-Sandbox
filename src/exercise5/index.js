/**
 * Make a script that get "serpapi" result urls for 10 locations on our Google Organic Search API
 */
import dotenv from "dotenv";
import { getJson } from "serpapi";
import { getInput } from "../utils/index.js";
dotenv.config();

const getOrganicResults = async (search) => {
  try {
    const apiKey = process.env.SERP_API_KEY;
    const data = await getJson({
      api_key: apiKey,
      q: search,
      hl: "en",
      gl: "us",
    });

    const organicResults = data.organic_results?.slice(0, 10);

    if (!organicResults) {
      return console.log(`No organic results found for ${search}`);
    }

    return console.log(
      `Top 10 organic results for ${search}:\n${organicResults.map((result) => `${result.position}: ${result.title} \(${result.link}\)`).join("\n")}`
    );
  } catch (error) {
    console.error("Error fetching organic results:", error.message);
  }
};

getInput(
  "Enter a search query to view the top 10 organic results: ",
  getOrganicResults
);
