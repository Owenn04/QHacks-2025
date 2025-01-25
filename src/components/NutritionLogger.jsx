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
        calories: nutritionData.calories || '',
        protein: nutritionData.protein || '',
        fat: nutritionData.fat || '',
        carbs: nutritionData.carbs || '',
        timestamp: new Date().toISOString()
      };

      console.log('Log entry created:', logEntry);

      // Get reference to the user's document
      const userDocRef = doc(db, 'users', userId.trim());
      
      // Get reference to the nutrition subcollection
      const nutritionCollectionRef = collection(userDocRef, 'nutritiondata');
      
      // Add the document to the subcollection
      const docRef = await addDoc(nutritionCollectionRef, logEntry);
      
      console.log('Nutrition log added with ID: ', docRef.id);
      if (onSuccess) {
        onSuccess(docRef.id);
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding nutrition log: ', error);
      if (onError) {
        onError(error);
      }
      throw error;
    }
  };

  // Add validation to the render
  if (!userId) {
    console.warn('NutritionLogger rendered without userId');
  }

  return (
    <div>
      <button
        onClick={logNutrition}
        disabled={!userId}
        className={`w-full ${userId ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'} text-white px-4 py-2 rounded-lg font-medium`}
      >
        Save Nutrition Data
      </button>
    </div>
  );
};

export default NutritionLogger;