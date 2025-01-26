import React from 'react';
import { Camera, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center gap-4 my-6">
      <button
        onClick={() => navigate('/camera')}
        className="flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-full transition-colors shadow-sm"
      >
        <Camera size={20} />
        <span className="font-medium">SCAN</span>
      </button>

      <button
        onClick={() => navigate('/addMeal')}
        className="flex items-center justify-center gap-2 pt-3 border border-orange-400 bg-white hover:bg-orange-100 active:bg-orange-100 text-orange-400 px-6 py-3 rounded-full transition-colors shadow-sm"
      >
        <Plus size={20} />
        <span className="font-medium">ADD</span>
      </button>
    </div>
  );
};

export default AddButtons;