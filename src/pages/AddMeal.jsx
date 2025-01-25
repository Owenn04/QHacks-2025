import React, { useState, useContext } from "react";
import Header from "../components/Header";
import axios from "axios";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UserContext } from "../App";

function AddMeal() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [servings, setServings] = useState(1);
  const user = useContext(UserContext);

  const fetchResults = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:5000/api/fatsecret", {
        params: { search_expression: query },
      });
      console.log("Proxy Response:", response.data); // Log the response

      if (response.data.foods && response.data.foods.food) {
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

  // Parse the food description to extract nutritional details
  const parseNutrition = (description) => {
    const nutrition = {};
    const cleanedDescription = description.replace("Per 100g - ", "");
    const parts = cleanedDescription.split("|");
    
  
    parts.forEach((part) => {
      const [key, value] = part.split(":").map((item) => item.trim());
      if (key && value) {
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
        if (!isNaN(numericValue)) {
          nutrition[key.trim().toLowerCase()] = numericValue;
        }
      }
    });
  
    return nutrition;
  };

  // Log the selected food item to Firestore
  const logFoodItem = async () => {
    if (!selectedFood) return;

    try {
      const nutrition = parseNutrition(selectedFood.food_description);
      const adjustedNutrition = {
        name: selectedFood.food_name, // Log the name of the food item
        calories: (parseFloat(nutrition.calories) * servings).toFixed(2),
        fat: (parseFloat(nutrition.fat) * servings).toFixed(2),
        carbs: (parseFloat(nutrition.carbs) * servings).toFixed(2),
        protein: (parseFloat(nutrition.protein) * servings).toFixed(2),
      };

      await addDoc(collection(db, `users/${user.user.uid}/foodLogs`), {
        ...adjustedNutrition,
        timestamp: serverTimestamp(),
      });

      setSelectedFood(null);
      setServings(1);
    } catch (error) {
      console.error("Error logging food item:", error);
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

        {/* Selected Food Modal */}
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
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Servings
                </label>
                <input
                  type="text"
                  value={servings === 0 ? "" : servings} // Show empty string if servings is 0
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setServings(value === "" ? 0 : value); // Set to 0 if empty, otherwise keep as string
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" ||
                      e.key === "Delete" ||
                      e.key === "ArrowLeft" ||
                      e.key === "ArrowRight" ||
                      e.key === "."
                    ) {
                      return;
                    }
                    // Prevent non-numeric input
                    if (isNaN(Number(e.key))) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                className="mt-4 w-full py-2 bg-orange-400 text-white rounded-lg"
                onClick={logFoodItem}
              >
                Add to History
              </button>
              <button
                className="mt-2 w-full py-2 bg-gray-300 text-gray-700 rounded-lg"
                onClick={() => setSelectedFood(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddMeal;