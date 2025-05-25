import { useEffect, useState } from "react";

export default function HomePage() {
  const [quote, setQuote] = useState("Welcome to FocusTrack!");
  const [goals, setGoals] = useState([]);
  const [sharedGoals, setSharedGoals] = useState([]);

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
          <ul className="list-disc pl-5">
            {goals.map(goal => (
              <li key={goal.id}>{goal.description}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">🤝 Shared With Me</h2>
        {sharedGoals.length === 0 ? (
          <p className="text-gray-500">No shared goals.</p>
        ) : (
          <ul className="list-disc pl-5">
            {sharedGoals.map(goal => (
              <li key={goal.id}>{goal.description}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
