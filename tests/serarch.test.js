import request from "supertest";
import app from "../server.js";

describe("Real API Tests", () => {

  test("API root responds", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("API is running");
  });

  test("Search rejects empty query", async () => {
    const res = await request(app)
      .post("/search")
      .send({ query: "" });

    expect(res.statusCode).toBe(400);
  });

});
