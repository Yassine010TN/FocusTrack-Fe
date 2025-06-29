import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function NewGoalPage() {
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [order, setOrder] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const query = useQuery();

  const parentGoalId = query.get("parentGoalId");
  const isStepGoal = !!parentGoalId;
  const orderLabel = isStepGoal ? "Step Order *" : "Order *";

  const validateForm = () => {
    if (!description.trim()) return setError("Description is required"), false;
    if (!startDate) return setError("Start date is required"), false;
    if (!dueDate) return setError("Due date is required"), false;
    if (!order || order < 1) return setError(`${orderLabel} must be 1 or greater`), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const params = new URLSearchParams({
        description: description.trim(),
        priority: priority.toString(),
        startDate,
        dueDate,
        ...(isStepGoal ? { stepOrder: order.toString() } : { order: order.toString() })
      });

      const url = isStepGoal
        ? `https://focustrack-production.up.railway.app/api/goals/${parentGoalId}/steps?${params.toString()}`
        : `https://focustrack-production.up.railway.app/api/goals/?${params.toString()}`;

      const res = await fetch(url, {
        method: "POST",
        headers
      });

      if (!res.ok) throw new Error(await res.text() || "Failed to create goal");

      setSuccess(isStepGoal ? "Step goal created successfully!" : "Goal created successfully!");
      if (!isStepGoal) {
        setDescription(""); setPriority(1); setStartDate(""); setDueDate(""); setOrder(1);
      }

      setTimeout(() => navigate(isStepGoal ? `/goals/${parentGoalId}` : "/home"), 1500);
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">
          {isStepGoal ? "➕ Create New Step Goal" : "🎯 Create New Goal"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-semibold block mb-1">Description *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Priority (1–5) *</label>
            <input
              type="number"
              min="1"
              max="5"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-24 border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">{orderLabel}</label>
            <input
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-24 border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {submitting
              ? isStepGoal
                ? "Creating step goal..."
                : "Creating..."
              : isStepGoal
              ? "Create Step Goal"
              : "Create Goal"}
          </button>
        </form>
      </div>
    </div>
  );
}
