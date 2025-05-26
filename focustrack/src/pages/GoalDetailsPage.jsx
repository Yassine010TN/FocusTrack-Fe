import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GoalDetailsPage({ isShared }) {
  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token");
  const [goalData, setGoalData] = useState(null);


  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };
    const endpoint = isShared
      ? `http://localhost:8080/api/sharing/my-shared-goals/${goalId}`
      : `http://localhost:8080/api/goals/${goalId}`;

    fetch(endpoint, { headers })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to load goal"))
      .then((data) => {
        if (isShared) {
          setGoal(data.goal);
          setGoalData(data); // full response: includes ownerEmail
        } else {
          setGoal(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load goal data.");
        setLoading(false);
      });
  }, [goalId, isShared, token]);


  const handleSave = async () => {
    if (!goal || isShared) return;
    setUpdating(true);
    try {
      // 1. Update description and priority
      await fetch(`http://localhost:8080/api/goals/${goalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: goal.description,
          priority: goal.priority,
        }),
      });

      // 2. Update done status
      await fetch(`http://localhost:8080/api/goals/${goalId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ done: goal.done }),
      });

      alert("Goal updated successfully!");
    } catch (err) {
      alert("Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!goal) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">🎯 {goal.description}</h1>

      <div className="space-y-4">
        {/* Editable only if it's user's own goal */}
        {isShared ? (
          <>
            <p><strong>🔗 Shared by:</strong> {goalData.ownerEmail}</p>
            <p><strong>📅 Start:</strong> {goal.startDate}</p>
            <p><strong>📅 Due:</strong> {goal.dueDate}</p>
            <p><strong>🔥 Priority:</strong> {"★".repeat(goal.priority)}{"☆".repeat(5 - goal.priority)}</p>
            <p><strong>✅ Done:</strong> {goal.done ? "Yes" : "No"}</p>
            <p><strong>📊 Progress:</strong> {goal.progress}%</p>
          </>
        ) : (
          <>
            <div>
              <label className="font-semibold block mb-1">Description:</label>
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded"
                value={goal.description}
                onChange={(e) => setGoal({ ...goal, description: e.target.value })}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Priority (1–5):</label>
              <input
                type="number"
                min="1"
                max="5"
                className="w-24 border border-gray-300 p-2 rounded"
                value={goal.priority}
                onChange={(e) =>
                  setGoal({ ...goal, priority: Math.max(1, Math.min(5, parseInt(e.target.value) || 1)) })
                }
              />
            </div>

            <div>
              <span className="font-semibold">📅 Start:</span> {goal.startDate}<br />
              <span className="font-semibold">📅 Due:</span> {goal.dueDate}
            </div>

            <div>
              <label className="font-semibold mr-2">✅ Done:</label>
              <input
                type="checkbox"
                checked={goal.done}
                onChange={(e) => setGoal({ ...goal, done: e.target.checked })}
              />
            </div>

            <div>
              <span className="font-semibold">📊 Progress:</span> {goal.progress}%
            </div>

            <button
              onClick={handleSave}
              disabled={updating}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
