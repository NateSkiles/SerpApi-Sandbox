/**
 * Make a script to get the open hours, rating, and number of reviews of a local business using our Google Maps API
 */
import dotenv from "dotenv";
import { getJson } from "serpapi";
dotenv.config();

try {
  const apiKey = process.env.SERP_API_KEY;
  // Get Place ID
  const data = await getJson({
    api_key: apiKey,
    engine: "google_maps",
    type: "search",
    q: "QD's Bar",
    ll: "@45.5219888,-122.7029788,14z",
    // Issue work around
    start: 0,
  }).then(async (response) => {
    if (!response?.local_results?.length) {
      return null;
    }

    const place_id = response.local_results[0].place_id;

    // Get place data
    const placeData = await getJson({
      api_key: apiKey,
      engine: "google_maps",
      type: "place",
      hl: "en",
      place_id,
    });
    return placeData.place_results;
  });

  if (!data) {
    console.log("No data found for this place");
  } else {
    console.log(
      `Here's some information about ${data.title}:\n---\nOpen hours: \n${data.hours
        .map((day) =>
          Object.entries(day)
            .map(
              ([key, value]) =>
                `\t${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
            )
            .join(", ")
        )
        .join(
          "\n"
        )}\nRating: ${data.rating}\nNumber of reviews: ${data.reviews}\n---`
    );
  }
} catch (error) {
  console.error("Error fetching restaurant data:", error.message);
}
