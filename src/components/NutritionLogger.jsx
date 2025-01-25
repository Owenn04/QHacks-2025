import React from 'react';
import { getFirestore, collection, addDoc, doc } from 'firebase/firestore';

const NutritionLogger = ({ nutritionData, userId, onSuccess, onError }) => {
  const logNutrition = async () => {
    // Add validation check
    if (!userId) {
      console.error('No userId provided to NutritionLogger');
      if (onError) {
        onError(new Error('No userId provided'));
      }
      return;
    }

    // Debug logs
    console.log('Attempting to log nutrition with:', {
      userId,
      nutritionData
    });

    try {
      const db = getFirestore();
      
      // Create the log entry with just the fields we want
      const logEntry = {
        name: nutritionData.name || 'Unknown Food Item',
        calories: nutritionData.calories || '',
        protein: nutritionData.protein || '',
        fat: nutritionData.fat || '',
        carbs: nutritionData.carbs || '',
        timestamp: new Date().toISOString()
      };

      console.log('Log entry created:', logEntry);

      // Get reference to the user's document and foodLogs collection
      const foodLogsRef = collection(db, 'users', userId.trim(), 'foodLogs');
      
      // Add the document to the foodLogs collection
      const docRef = await addDoc(foodLogsRef, logEntry);
      
      console.log('Food log added with ID: ', docRef.id);
      if (onSuccess) {
        onSuccess(docRef.id);
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding food log: ', error);
      if (onError) {
        onError(error);
      }
      throw error;
    }
  };

  return (
    <div>
      <button
        onClick={logNutrition}
        disabled={!userId}
        className={`w-full ${userId ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'} text-white px-4 py-2 rounded-lg font-medium`}
      >
        Save {nutritionData.name ? nutritionData.name : 'Nutrition Data'}
      </button>
    </div>
  );
};

export default NutritionLogger;