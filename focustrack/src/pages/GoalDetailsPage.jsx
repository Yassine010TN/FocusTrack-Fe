import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GoalDetailsPage() {
  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:8080/api/goals/${goalId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load goal")))
      .then((data) => {
        setGoal(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load goal data.");
        setLoading(false);
      });
  }, [goalId, token]);

  const handleSave = async () => {
    if (!goal) return;
    setUpdating(true);
    try {
      // Send a single PATCH with all editable properties
      await fetch(`http://localhost:8080/api/goals/${goalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: goal.description,
          priority: goal.priority,
          progress: goal.progress,
          startDate: goal.startDate,
          dueDate: goal.dueDate,
          isDone: goal.done,        // map to isDone
          goalOrder: goal.order     // map to goalOrder
        }),
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
        {/* Description */}
        <div>
          <label className="font-semibold block mb-1">Description:</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={goal.description}
            onChange={(e) => setGoal({ ...goal, description: e.target.value })}
          />
        </div>

        {/* Priority */}
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

        {/* Progress */}
        <div>
          <label className="font-semibold block mb-1">Progress (%):</label>
          <input
            type="number"
            min="0"
            max="100"
            className="w-24 border border-gray-300 p-2 rounded"
            value={goal.progress}
            onChange={(e) =>
              setGoal({ ...goal, progress: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })
            }
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="font-semibold block mb-1">Start Date:</label>
          <input
            type="date"
            className="w-40 border border-gray-300 p-2 rounded"
            value={goal.startDate}
            onChange={(e) => setGoal({ ...goal, startDate: e.target.value })}
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="font-semibold block mb-1">Due Date:</label>
          <input
            type="date"
            className="w-40 border border-gray-300 p-2 rounded"
            value={goal.dueDate}
            onChange={(e) => setGoal({ ...goal, dueDate: e.target.value })}
          />
        </div>

        {/* Done */}
        <div>
          <label className="font-semibold mr-2">✅ Done:</label>
          <input
            type="checkbox"
            checked={goal.done}
            onChange={(e) => setGoal({ ...goal, done: e.target.checked })}
          />
        </div>

        {/* Order */}
        <div>
          <label className="font-semibold block mb-1">Goal Order:</label>
          <input
            type="number"
            className="w-24 border border-gray-300 p-2 rounded"
            value={goal.order || 0}
            onChange={(e) => setGoal({ ...goal, order: parseInt(e.target.value) || 0 })}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={updating}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
