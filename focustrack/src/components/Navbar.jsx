import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md px-6 py-3">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="text-lg font-bold flex items-center gap-2">
          🎯 <span>FocusTrack</span>
        </div>
        <ul className="flex gap-6 text-sm items-center">
          <li>
            <Link
              to="/home"
              className="hover:bg-blue-500 px-3 py-2 rounded-md transition duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/contacts"
              className="hover:bg-blue-500 px-3 py-2 rounded-md transition duration-200"
            >
              Contacts
            </Link>
          </li>
          <li>
            <Link
              to="/goals"
              className="hover:bg-blue-500 px-3 py-2 rounded-md transition duration-200"
            >
              Goals
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="hover:bg-blue-500 px-3 py-2 rounded-md transition duration-200"
            >
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="hover:bg-blue-500 px-3 py-2 rounded-md transition duration-200"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}



