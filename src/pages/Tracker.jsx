import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Header from "../components/Header";

function TrackerPage() {
  const [foodLogs, setFoodLogs] = useState([]);
  const [timeframe, setTimeframe] = useState("today"); // Default timeframe
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Replace with the logged-in user's ID
  const userId = "USER_ID";

  // Fetch food logs based on the selected timeframe
  const fetchFoodLogs = async () => {
    setLoading(true);
    setError("");

    try {
      const now = new Date();
      let startDate;

      switch (timeframe) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "thisWeek":
          startDate = new Date(now.setDate(now.getDate() - now.getDay()));
          break;
        case "thisMonth":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0); // All time
      }

      const foodLogsRef = collection(db, `users/${userId}/foodLogs`);
      const q = query(
        foodLogsRef,
        where("timestamp", ">=", startDate)
      );

      const querySnapshot = await getDocs(q);
      const logs = [];
      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });

      setFoodLogs(logs);
    } catch (err) {
      setError("Failed to fetch food logs. Please try again.");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals for calories, fat, carbs, and protein
  const calculateTotals = () => {
    const totals = {
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    };

    foodLogs.forEach((log) => {
      totals.calories += parseFloat(log.calories) || 0;
      totals.fat += parseFloat(log.fat) || 0;
      totals.carbs += parseFloat(log.carbs) || 0;
      totals.protein += parseFloat(log.protein) || 0;
    });

    return totals;
  };

  useEffect(() => {
    fetchFoodLogs();
  }, [timeframe]);

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Food Tracker</h1>

        {/* Timeframe Selector */}
        <div className="mb-4">
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
            Select Timeframe:
          </label>
          <select
            id="timeframe"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>

        {/* Totals */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Totals</h2>
          <ul className="space-y-1">
            <li className="text-sm text-gray-700">Calories: {totals.calories.toFixed(2)} kcal</li>
            <li className="text-sm text-gray-700">Fat: {totals.fat.toFixed(2)} g</li>
            <li className="text-sm text-gray-700">Carbs: {totals.carbs.toFixed(2)} g</li>
            <li className="text-sm text-gray-700">Protein: {totals.protein.toFixed(2)} g</li>
          </ul>
        </div>

        {/* Food Logs */}
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <ul className="space-y-3">
          {foodLogs.map((log) => (
            <li key={log.id} className="p-4 border rounded-lg bg-white shadow-sm">
              <p className="font-medium">{log.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(log.timestamp?.toDate()).toLocaleString()}
              </p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-700">Calories: {log.calories} kcal</li>
                <li className="text-sm text-gray-700">Fat: {log.fat} g</li>
                <li className="text-sm text-gray-700">Carbs: {log.carbs} g</li>
                <li className="text-sm text-gray-700">Protein: {log.protein} g</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TrackerPage;