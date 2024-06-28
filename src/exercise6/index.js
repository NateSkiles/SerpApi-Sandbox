/**
 * Make a script that get "serpapi" result urls with our Google Organic Search API, Yahoo API, Baidu API, and Bing API
 */
import dotenv from "dotenv";
import { getJson } from "serpapi";
dotenv.config();

const searchEngines = [
  { engine: "google" },
  { engine: "yahoo" },
  { engine: "baidu" },
  { engine: "bing" },
];

async function fetchSearchResults() {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) {
    console.error("SERP_API_KEY is not defined.");
    return;
  }

  const QUERY = "serpapi";

  const fetchEngineResults = async ({ engine }) => {
    try {
      const queryParams = engine === "yahoo" ? { p: QUERY } : { q: QUERY };
      const result = await getJson({ engine, api_key: apiKey, ...queryParams });
      
      return { [engine]: result };
    } catch (error) {
      console.error(`Failed to fetch results for ${engine}:`, error);
      return {
        [engine]: { error: `Failed to fetch results: ${error.message}` },
      };
    }
  };

  const promises = searchEngines.map((engine) => fetchEngineResults(engine));
  const results = await Promise.all(promises);

  return results;
}

fetchSearchResults().then((results) => {
  results.forEach((result) => {
    const engineName = Object.keys(result)[0];
    const organicResults = result[engineName].organic_results;
    console.log(`${engineName} Organic Results:\n---`);
    organicResults.forEach((organicResult) => {
      console.log(
        `${organicResult.position} - ${organicResult.title} (${organicResult.link})`
      );
    });
    console.log("\n");
  });
});
