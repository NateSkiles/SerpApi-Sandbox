/**
 * Make a script to fetch the date of birth of any famous person using our API.
 * For this task, work on two versions. One using direct GET requests and parsing the JSON.
 * One using one of our official libraries. (https://github.com/serpapi).
 * You can use any of the languages we have an official library in. (optional if not technical)
 * Make a third version from scratch without using SerpApi at all: try to scrape Google directly.
 */

import version1 from "./version1.js";
import version2 from "./version2.js";
import { getInput } from "../utils/index.js";

const arg = process.argv[2]; // Get the argument passed

const fetchDateOfBirth = async (name) => {
  if (arg === "-v1") {
    return await version1(name); // Run version1 if -1 is passed
  } else if (arg === "-v2") {
    return await version2(name); // Run version2 if -2 is passed
  } else {
    console.log("Invalid argument. Please use -1 or -2.");
    process.exit(1); // Exit the process for invalid arguments
  }
};

getInput("Enter the name of the famous person: ", fetchDateOfBirth);
