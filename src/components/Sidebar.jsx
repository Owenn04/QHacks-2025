import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isClosing, setIsClosing] = useState(false);
  const menuItems = [
    { title: 'Home', path: '/' },
    { title: 'Scan Label', path: '/camera' },
    { title: 'Add Meal', path: '/addmeal' },
    { title: 'Goals', path: '/goals' },
    { title: 'History', path: '/tracker' },
    { title: 'Profile', path: '/profile' },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true); // Start the closing animation
    setTimeout(() => {
      setIsOpen(false); // Close the sidebar after the animation
      setIsClosing(false); // Reset the closing state
    }, 300); // Match the duration of the transition
  };

  return (
    <aside className={`fixed inset-0 z-50 ${isOpen ? 'visible' : 'invisible'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      
      <div
        className={`absolute right-0 top-0 h-full bg-white transform transition-transform duration-300 w-3/4 
          ${isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'} 
          md:!w-1/3`}
      >
        <div className="p-4 flex justify-end">
          <button 
            type="button"
            className="p-3 -m-3 hover:bg-gray-200 rounded-lg"
            aria-label="Close menu"
            onClick={handleClose}
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="px-4">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className="block py-4 px-2 text-gray-800 text-lg font-medium font-serif border-b border-gray-200 hover:bg-orange-100 active:bg-orange-300 active:text-white transition-colors duration-200"
              onClick={handleClose}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;