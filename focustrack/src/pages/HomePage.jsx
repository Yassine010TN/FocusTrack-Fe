import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [quote, setQuote] = useState("Welcome to FocusTrack!");
  const [goals, setGoals] = useState([]);
  const [sharedGoals, setSharedGoals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent("https://stoic.tekloon.net/stoic-quote")}&timestamp=${new Date().getTime()}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const parsed = JSON.parse(data.contents);
        const quote = parsed.data.quote;
        const author = parsed.data.author;
        setQuote(`${quote} — ${author}`);
      })
      .catch(() => setQuote("Stay strong. Be present."));

    // Fetch goals and shared goals with token
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    fetch("http://localhost:8080/api/goals/", { headers })
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch goals"))
      .then(data => setGoals(data))
      .catch(() => setGoals([]));

    fetch("http://localhost:8080/api/sharing/my-shared-goals", { headers })
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch shared goals"))
      .then(data => setSharedGoals(data))
      .catch(() => setSharedGoals([]));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold mb-2">🌟 Quote of the Day</h2>
        <p className="italic text-gray-700">{quote}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">🎯 My Goals</h2>
        {goals.length === 0 ? (
          <p className="text-gray-500">No goals yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const priority = Math.max(0, Math.min(goal.priority || 0, 5)); // Clamp between 0 and 5
              return (
                <div
                  key={goal.id}
                  onClick={() => navigate(`/goals/${goal.id}`)}
                  className="cursor-pointer border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 transition"
                >
                  <h3 className="font-bold text-lg text-blue-800 mb-1">{goal.description}</h3>
                  <p className="text-sm text-gray-700">📅 {goal.startDate} → {goal.dueDate}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    🔥 Priority: {"★".repeat(priority)}{"☆".repeat(5 - priority)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>


      <div>
        <h2 className="text-lg font-semibold mb-2">🤝 Shared With Me</h2>
        {sharedGoals.length === 0 ? (
          <p className="text-gray-500">No shared goals.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {sharedGoals.map(({ goal, ownerEmail }) => {
              const priority = Math.max(0, Math.min(goal.priority || 0, 5));
              return (
                <div
                  key={goal.id}
                  onClick={() => navigate(`/shared-goals/${goal.id}`)}
                  className="cursor-pointer border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md hover:bg-yellow-50 transition"
                >
                  <h3 className="font-bold text-lg text-blue-800 mb-1">{goal.description}</h3>
                  <p className="text-sm text-gray-700">📅 {goal.startDate} → {goal.dueDate}</p>
                  <p className="text-sm text-gray-700">🔥 Priority: {"★".repeat(priority)}{"☆".repeat(5 - priority)}</p>
                  <p className="text-sm text-gray-600 mt-1">👤 Shared by: <span className="font-medium">{ownerEmail}</span></p>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
