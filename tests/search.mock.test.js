/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";
import request from "supertest";
import app from "../server.js";

// ESM-compatible Jest mock
jest.unstable_mockModule("../services/searchService.js", () => ({
  getSearchResults: jest.fn().mockResolvedValue({
    organic_results: [
      {
        title: "OpenAI Official",
        link: "https://openai.com",
        snippet: "OpenAI builds artificial intelligence."
      },
      {
        title: "ChatGPT",
        link: "https://chat.openai.com",
        snippet: "ChatGPT is a conversational model."
      }
    ]
  })
}));

// Must import AFTER mock
const { getSearchResults } = await import("../services/searchService.js");

describe("POST /search mocked test", () => {
  test("returns mocked search results", async () => {
    const response = await request(app)
      .post("/search")
      .send({ query: "OpenAI" });

    expect(response.status).toBe(200);
    expect(getSearchResults).toHaveBeenCalledTimes(1);
    expect(response.body.results.length).toBe(2);
    expect(response.body.query).toBe("OpenAI");
  });
});
