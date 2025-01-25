import express from "express";
import cors from "cors";
import axios from "axios";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { parseStringPromise } from "xml2js"; // Import xml2js
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") }); // Load environment variables from .env file

const app = express();

app.use(cors());
app.use(express.json());

const apiKey = process.env.FATSECRET_KEY;
const apiSecret = process.env.FATSECRET_SECRET;

const oauth = OAuth({
  consumer: {
    key: apiKey,
    secret: apiSecret,
  },
  signature_method: "HMAC-SHA1",
  hash_function(baseString, key) {
    return crypto.createHmac("sha1", key).update(baseString).digest("base64");
  },
});

app.get("/api/fatsecret", async (req, res) => {
  const { search_expression } = req.query;

  if (!search_expression) {
    return res.status(400).json({ error: "search_expression is required" });
  }

  const requestData = {
    url: "https://platform.fatsecret.com/rest/server.api",
    method: "GET",
    data: {
      method: "foods.search",
      search_expression: search_expression,
      format: "json",
    },
  };

  // Generate OAuth authorization data
  const authData = oauth.authorize(requestData);

  // Include OAuth parameters in the query string
  const queryParams = {
    ...requestData.data, // Include the API method and search expression
    ...authData, // Include OAuth parameters
  };

  try {
    const response = await axios.get(requestData.url, {
      params: queryParams, // Send all parameters in the query string
    });

    // console.log("Raw API Response:", response.data); // Log the raw response

    if (typeof response.data === "object") {
      res.json(response.data); // Forward JSON response directly
    } else {
      const result = await parseStringPromise(response.data, { explicitArray: false });
      console.log("Parsed Response:", result); // Log the parsed response
      res.json(result);
    }
  } catch (err) {
    console.error("Proxy Server Error:", err);

    if (err.response) {
      console.error("API Response Error:", err.response.data);
      res.status(err.response.status).json({ error: err.response.data });
    } else if (err.request) {
      console.error("No response received from API:", err.request);
      res.status(500).json({ error: "No response received from FatSecret API" });
    } else {
      console.error("Internal Server Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});