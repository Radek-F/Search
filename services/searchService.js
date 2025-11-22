import fetch from "node-fetch";

export async function getSearchResults(query, apiKey) {
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&engine=google&api_key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  return data;
}
