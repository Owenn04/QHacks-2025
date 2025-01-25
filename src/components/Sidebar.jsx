import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
 const menuItems = [
   { title: 'Home', path: '/' },
   { title: 'Scan Label', path: '/camera' },
   { title: 'Add Meal', path: '/addmeal' },
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

 return (
   <aside className={`fixed inset-0 z-50 ${isOpen ? 'visible' : 'invisible'}`}>
     <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
     
     <div className={`absolute right-0 top-0 h-full w-3/4 bg-orange-400 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
       <div className="p-4 flex justify-end">
         <button 
           type="button"
           className="p-3 -m-3 hover:bg-orange-500 rounded-lg"
           aria-label="Close menu"
           onClick={() => setIsOpen(false)}
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
             className="block py-4 text-white text-lg font-medium border-b border-orange-300"
             onClick={() => setIsOpen(false)}
           >
             {item.title}
           </Link>
         ))}
       </nav>
     </div>
   </aside>
 );
};

export default Sidebar