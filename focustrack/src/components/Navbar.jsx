import { Link, NavLink } from 'react-router-dom';
import { useState, useRef } from 'react';

export default function Navbar() {
  const [contactsOpen, setContactsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setContactsOpen(true);
  };

  const handleMouseLeave = () => {
    // Delay closing the menu by 200ms to prevent flicker
    timeoutRef.current = setTimeout(() => {
      setContactsOpen(false);
    }, 200);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-blue-600 text-white">
      {/* Left side: Logo / Name */}
      <div className="text-2xl font-bold tracking-wide cursor-pointer">
        <NavLink to="/home" className="hover:underline">
          FocusTrack
        </NavLink>
      </div>

      {/* Right side: Nav items */}
      <div className="flex items-center space-x-6">
        <NavLink to="/home" className="hover:underline">
          Home
        </NavLink>

        {/* Contacts dropdown container */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="focus:outline-none flex items-center space-x-1">
            <span>Contacts</span>
            <span>▼</span>
          </button>

          {contactsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-md z-50">
              <Link
                to="/contacts/search"
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setContactsOpen(false)}
              >
                Search User
              </Link>
              <Link
                to="/contacts/list"
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setContactsOpen(false)}
              >
                My Contacts
              </Link>
              <Link
                to="/contacts/sent"
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setContactsOpen(false)}
              >
                Sent Invitations
              </Link>
              <Link
                to="/contacts/received"
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setContactsOpen(false)}
              >
                Received Invitations
              </Link>
            </div>
          )}
        </div>

        <NavLink
          to="/goals/new"
          className="hover:underline"
        >
          New Goal
        </NavLink>
        <NavLink to="/profile" className="hover:underline">
          Profile
        </NavLink>
        <NavLink to="/logout" className="hover:underline">
          Logout
        </NavLink>
      </div>
    </nav>
  );
}
