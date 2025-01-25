import React, { useState } from 'react';
import Header from "../components/Header";
import axios from "axios";

function AddMeal() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFood, setSelectedFood] = useState(null); // Track the selected food item

  const fetchResults = async () => {
    setLoading(true);
    setError("");
    setSelectedFood(null); // Clear the selected food when performing a new search

    try {
      const response = await axios.get("http://localhost:5000/api/fatsecret", {
        params: { search_expression: query },
      });
      console.log("Proxy Response:", response.data); // Log the response

      // Check if the response contains the expected data
      if (response.data.foods && response.data.foods.food) {
        // Ensure the food data is always an array
        const foodData = Array.isArray(response.data.foods.food)
          ? response.data.foods.food
          : [response.data.foods.food];
        setResults(foodData);
      } else {
        setResults([]); // No results found
        setError("No results found.");
      }
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
      console.error("Fetch Error:", err); // Log the error
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

  // Parse the food description to extract nutritional details
  const parseNutrition = (description) => {
    const nutrition = {};
    const parts = description.split("|");
    parts.forEach((part) => {
      const [key, value] = part.split(":");
      if (key && value) {
        nutrition[key.trim().toLowerCase()] = value.trim();
      }
    });
    return nutrition;
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
              className="p-4 border rounded-lg bg-white shadow-sm cursor-pointer"
              onClick={() => setSelectedFood(item)} // Set the selected food item
            >
              <p className="font-medium">{item.food_name}</p>
              <p className="text-sm text-gray-500">
                {item.food_description || "No description available"}
              </p>
            </li>
          ))}
        </ul>

        {/* Modal for Nutritional Details */}
        {selectedFood && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-2">{selectedFood.food_name}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {selectedFood.food_description || "No description available"}
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Nutritional Information</h3>
                <ul className="mt-2 space-y-1">
                  {Object.entries(parseNutrition(selectedFood.food_description)).map(
                    ([key, value], index) => (
                      <li key={index} className="text-sm text-gray-700">
                        <span className="capitalize">{key}</span>: {value}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <button
                className="mt-4 w-full py-2 bg-orange-400 text-white rounded-lg"
                onClick={() => setSelectedFood(null)} // Close the modal
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddMeal;