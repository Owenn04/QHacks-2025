import React, { useState } from 'react'
import Header from "../components/Header";
import axios from "axios";
import OAuth from "oauth-1.0a";
import CryptoJS from "crypto-js";


function AddMeal() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_FATSECRET_KEY;
  const apiSecret = import.meta.env.VITE_FATSCRET_SECRET;

  const fetchResults = async () => {
    setLoading(true);
    setError("");

    const oauth = OAuth({
      consumer: { key: apiKey, secret: apiSecret },
      signature_method: "HMAC-SHA1",
      hash_function(baseString, key) {
        return CryptoJS.HmacSHA1(baseString, key).toString(CryptoJS.enc.Base64);
      },
    });

    const requestData = {
      url: "https://cors-anywhere.herokuapp.com/corsdemo/https://platform.fatsecret.com/rest/server.api",
      method: "GET",
      data: {
        method: "foods.search",
        search_expression: query,
        format: "json",
      },
    };

    try {
      const response = await axios.get(requestData.url, {
        params: requestData.data,
        headers: oauth.toHeader(oauth.authorize(requestData)),
      });
      setResults(response.data.foods.food || []);
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchResults();
    }
  };

  return (
    <div className="min-h-screen bg-offwhite">
    <Header />
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Search Food</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg text-sm"
          placeholder="Enter food..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 w-full py-3 bg-orange-400 text-white rounded-lg"
        >
          Search
        </button>
      </form>
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <ul className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-3">
        {results.map((item, index) => (
          <li
            key={index}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <p className="font-medium">{item.food_name}</p>
            <p className="text-sm text-gray-500">
              {item.food_description || "No description available"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default AddMeal