import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SharedGoalPage() {
  const { goalId } = useParams();
  const [goalData, setGoalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:8080/api/sharing/my-shared-goals/${goalId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load shared goal")))
      .then((data) => {
        setGoalData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load shared goal data.");
        setLoading(false);
      });
  }, [goalId, token]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!goalData) return null;

  const { goal, ownerEmail } = goalData;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">🎯 {goal.description}</h1>

      <div className="space-y-4">
        <p>
          <strong>🔗 Shared by:</strong> {ownerEmail}
        </p>
        <p>
          <strong>📅 Start:</strong> {goal.startDate}
        </p>
        <p>
          <strong>📅 Due:</strong> {goal.dueDate}
        </p>
        <p>
          <strong>🔥 Priority:</strong> {"★".repeat(goal.priority)}{"☆".repeat(5 - goal.priority)}
        </p>
        <p>
          <strong>✅ Done:</strong> {goal.done ? "Yes" : "No"}
        </p>
        <p>
          <strong>📊 Progress:</strong> {goal.progress}%
        </p>
      </div>
    </div>
  );
}
