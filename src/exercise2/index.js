/**
 * Make a script to fetch the list of subsidiaries (carousel view like "apple subsidiaries") of any company in the world using our API
 */
import dotenv from "dotenv";
import { getJson } from "serpapi";
import { getInput } from "../utils/index.js";
dotenv.config();

const fetchSubsidiaries = async (name) => {
  try {
    const apiKey = process.env.SERP_API_KEY;
    const data = await getJson({
      api_key: apiKey,
      q: `${encodeURIComponent(name)} subsidiaries`,
      hl: "en",
    });

    const subsidiaries =
      data.knowledge_graph?.subsidiaries?.map(
        (subsidiary) => subsidiary.name
      ) || [];

    if (!subsidiaries.length) {
      return console.log(`No subsidiaries found for ${name}`);
    }

    console.log(
      `Subsidiaries of ${name}:`,
      subsidiaries.map((name) => `\n- ${name}`).join("")
    );
  } catch (error) {
    console.error("Error fetching subsidiaries:", error.message);
  }
};

getInput(
  "Enter the name of company to view their subsidiaries: ",
  fetchSubsidiaries
);
