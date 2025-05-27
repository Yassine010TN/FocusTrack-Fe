import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Simple validation
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!startDate) {
      setError("Start date is required");
      return;
    }
    if (!dueDate) {
      setError("Due date is required");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/api/goals/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          priority: Number(priority),
          startDate,
          dueDate,
          order: Number(order),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create goal");
      }

      setSuccess("Goal created successfully!");
      // Optionally clear form or redirect to goals page
      setDescription("");
      setPriority(1);
      setStartDate("");
      setDueDate("");
      setOrder(1);

      // Redirect to /home or goals list after short delay
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Create New Goal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-semibold mb-1" htmlFor="description">
            Description *
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="priority">
            Priority (1-5) *
          </label>
          <input
            id="priority"
            type="number"
            min="1"
            max="5"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-24 border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="startDate">
            Start Date *
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="dueDate">
            Due Date *
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="order">
            Order *
          </label>
          <input
            id="order"
            type="number"
            min="1"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-24 border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {submitting ? "Creating..." : "Create Goal"}
        </button>
      </form>
    </div>
  );
}
