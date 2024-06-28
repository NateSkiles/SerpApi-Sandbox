import fs from "fs";
import Papa from "papaparse";
import dotenv from "dotenv";
import { getJson, getJsonBySearchId } from "serpapi";
dotenv.config();

async function fetchSerpApiRanks(keywords, batchSize = 250) {
  const batches = [];
  for (let i = 0; i < keywords.length; i += batchSize) {
    batches.push(keywords.slice(i, i + batchSize));
  }

  const searchIds = [];

  // Submit all requests with async=true
  for (const [index, batch] of batches.entries()) {
    console.log(`Submitting batch ${index + 1} of ${batches.length}...`);
    const promises = batch.map((keyword) =>
      getJson({
        api_key: process.env.SERP_API_KEY,
        engine: "google",
        q: keyword.Keyword,
        location: keyword.Location,
        num: 10,
        async: true, // Enable async requests
      }).then((response) => {
        if (response.search_metadata.id) {
          searchIds.push({
            keyword: keyword,
            search_id: response.search_metadata.id,
          });
        }
      })
    );
    await Promise.allSettled(promises);
    console.log(`Batch submitted for async processing.`);
  }

  // Wait (in seconds) for all requests to complete
  await delay(10);

  const csvResults = [];

  // Retrieve results using search_id
  async function processSearches(searchIds) {
    console.log(`Fetching ${searchIds.length} searches...`);
    const searchBatches = [];
    for (let i = 0; i < searchIds.length; i += batchSize) {
      searchBatches.push(searchIds.slice(i, i + batchSize));
    }

    const searchesToRetry = [];
    for (const { keyword, search_id } of searchIds) {
      try {
        const result = await getJsonBySearchId(search_id, {
          api_key: process.env.SERP_API_KEY,
        });
        const status = result.search_metadata.status;
        if (status === "Success") {
          console.log(`Search with ID ${search_id} succeeded!`);
          const organicResults = result.organic_results;
          let found = false;
          for (let i = 0; i < organicResults.length; i++) {
            if (organicResults[i].link.includes("serpapi.com")) {
              csvResults.push({
                Keyword: keyword.Keyword,
                Location: keyword.Location,
                Position: organicResults[i].position,
              });
              found = true;
              break;
            }
          }
          if (!found) {
            csvResults.push({
              Keyword: keyword.Keyword,
              Location: keyword.Location,
              Position: null,
            });
          }
        } else if (status === "Queued" || status === "Processing") {
          console.log(`Search with ID ${search_id} is still processing...`);
          searchesToRetry.push({ keyword, search_id });
        } else {
          console.error(
            `Search with ID ${search_id} resulted in status: ${status}`
          );
        }
      } catch (error) {
        console.error(
          `Failed to retrieve results for search_id: ${search_id}`,
          error
        );
      }
    }
    if (searchesToRetry.length > 0) {
      console.log(`Retrying ${searchesToRetry.length} searches...`);
      await delay(10); // Wait a bit before retrying
      await processSearches(searchesToRetry); // Recursive call
    }
  }

  await processSearches(searchIds); // Initial call to process searches

  // Convert results array to CSV and write to file
  const csv = Papa.unparse(csvResults);
  fs.writeFileSync("src/exercise8/serpapi_rankings.csv", csv);
}

async function delay(time) {
  console.log("Waiting for results...");
  return new Promise((resolve) => setTimeout(resolve, time * 1000));
}

// Read the CSV file and parse keywords
const csvContent = fs.readFileSync(
  "src/exercise8/tracking_keywords.csv",
  "utf8"
);
const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
const keywords = parsed.data;

fetchSerpApiRanks(keywords).catch((e) => console.error(e));
