/**
 * Recreate the script to fetch serpapi.com ranks of the list of keywords we are tracking.
 */
import fs from "fs";
import Papa from "papaparse";
import dotenv from "dotenv";
import { getJson } from "serpapi";
dotenv.config();

async function fetchSerpApiRanks(keywords, batchSize = 250) {
  // Split keywords into batches
  const batches = [];
  for (let i = 0; i < keywords.length; i += batchSize) {
    batches.push(keywords.slice(i, i + batchSize));
  }

  const csvResults = [];

  for (const [index, batch] of batches.entries()) {
    console.log(`Processing batch ${index + 1} of ${batches.length}`);
    // Creates an array of promises, for each keyword in the batch
    const promises = batch.map((keyword) =>
      getJson({
        api_key: process.env.SERP_API_KEY,
        engine: "google",
        q: keyword.Keyword,
        location: keyword.Location,
        num: 100,
      })
    );

    // Wait for all promises to resolve
    const results = await Promise.allSettled(promises);
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const organicResults = result.value.organic_results;
        let found = false;
        // Search for 'serpapi.com' in the organic results
        for (let i = 0; i < organicResults.length; i++) {
          if (organicResults[i].link.includes("serpapi.com")) {
            csvResults.push({
              Keyword: batch[index].Keyword,
              Location: batch[index].Location,
              Position: organicResults[i].position,
            });
            found = true;
            break; // Stop searching once the first match is found
          }
        }
        // If 'serpapi.com' is not found in the organic results, add a null position
        if (!found) {
          csvResults.push({
            Keyword: batch[index].Keyword,
            Location: batch[index].Location,
            Position: null,
          });
        }
      } else {
        console.error(
          `Failed for keyword: ${batch[index].Keyword}`,
          result.reason
        );
      }
    });
  }

  // Convert results array to CSV and write to file
  const csv = Papa.unparse(csvResults);
  fs.writeFileSync("src/exercise7/serpapi_rankings.csv", csv);
}

// Read the CSV file and parse keywords
const csvContent = fs.readFileSync(
  "src/exercise7/tracking_keywords.csv",
  "utf8"
);
const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
const keywords = parsed.data;

fetchSerpApiRanks(keywords).catch((e) => console.error(e));
