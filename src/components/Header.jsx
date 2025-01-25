import { useState } from 'react';
import Sidebar from './Sidebar';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    const handleToggle = (e) => {
      e.preventDefault();
      setIsOpen(!isOpen);
    };
     
    return (
      <>
        <div className="flex justify-between items-center p-4">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <button onClick={handleToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </>
    );
  };

export default Header