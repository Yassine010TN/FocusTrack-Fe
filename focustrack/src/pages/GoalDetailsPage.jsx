import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GoalDetailsPage() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [sharingUsers, setSharingUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [sharingLoading, setSharingLoading] = useState(false);
  const [sharingError, setSharingError] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    // Load goal
    fetch(`https://focustrack-production.up.railway.app/api/goals/${goalId}`, {
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

  useEffect(() => {
    if (!token || !goal || goal.hierarchy !== 1) return;

    // Load shared users for this goal
    fetch(`https://focustrack-production.up.railway.app/api/sharing/shared/${goalId}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load shared users")))
      .then((data) => setSharingUsers(data))
      .catch(() => setSharingUsers([]));

    // Load comments for this goal
    fetch(`https://focustrack-production.up.railway.app/api/sharing/comments/${goalId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load comments")))
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  }, [goalId, goal, token]);

  const handleSave = async () => {
    if (!goal) return;
    setUpdating(true);
    try {
      await fetch(`https://focustrack-production.up.railway.app/api/goals/${goalId}`, {
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
          isDone: goal.done,
          goalOrder: goal.order,
        }),
      });

      alert("Goal updated successfully!");
    } catch (err) {
      alert("Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this goal? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`https://focustrack-production.up.railway.app/api/goals/${goalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");

      alert("Goal deleted successfully!");
      navigate("/home");
    } catch (err) {
      alert("Failed to delete goal.");
    }
  };

  const handleShare = async () => {
    setSharingError("");
    if (!selectedContactId) {
      setSharingError("Please select a contact to share.");
      return;
    }
    setSharingLoading(true);
    try {
      const res = await fetch(
        `https://focustrack-production.up.railway.app/api/sharing/share?goalId=${goalId}&contactId=${selectedContactId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to share goal.");
      }
      // Refresh shared users list
      const refreshed = await fetch(`https://focustrack-production.up.railway.app/api/sharing/shared/${goalId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshed.ok) {
        const users = await refreshed.json();
        setSharingUsers(users);
      }
      setSelectedContactId(""); // reset selection
    } catch (err) {
      setSharingError(err.message);
    } finally {
      setSharingLoading(false);
    }
  };
  const handleUnshare = async (contactId) => {
    if (!window.confirm("Are you sure you want to unshare this goal with this user?")) return;

    try {
      const res = await fetch(
        `https://focustrack-production.up.railway.app/api/sharing/share/${goalId}/${contactId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to unshare");

      // Refresh shared users list
      const refreshed = await fetch(`https://focustrack-production.up.railway.app/api/sharing/shared/${goalId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshed.ok) {
        const users = await refreshed.json();
        setSharingUsers(users);
      }
    } catch (err) {
      alert(err.message || "Failed to unshare goal.");
    }
  };
  // Add a comment
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const res = await fetch(
        `https://focustrack-production.up.railway.app/api/sharing/comment?goalId=${goalId}&text=${encodeURIComponent(commentText)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to add comment");

      setCommentText("");
      // Refresh comments list
      const refreshedComments = await fetch(`https://focustrack-production.up.railway.app/api/sharing/comments/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshedComments.ok) {
        const commentsData = await refreshedComments.json();
        setComments(commentsData);
      }
    } catch (err) {
      alert(err.message || "Failed to add comment.");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`https://focustrack-production.up.railway.app/api/sharing/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      // Refresh comments list
      const refreshedComments = await fetch(`https://focustrack-production.up.railway.app/api/sharing/comments/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshedComments.ok) {
        const commentsData = await refreshedComments.json();
        setComments(commentsData);
      }
    } catch (err) {
      alert(err.message || "Failed to delete comment.");
    }
  };

  useEffect(() => {
    if (!token || !goal || goal.hierarchy !== 1) return;

    fetch("https://focustrack-production.up.railway.app/api/users/contacts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load contacts")))
      .then((data) => setContacts(data))
      .catch(() => setContacts([]));
  }, [token, goal]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!goal) return null;

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
          🎯 {goal.description}
        </h1>

        {/* Editable fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Description:</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              value={goal.description}
              onChange={(e) => setGoal({ ...goal, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Priority (1–5):</label>
            <input
              type="number"
              min="1"
              max="5"
              className="w-full border border-gray-300 p-2 rounded"
              value={goal.priority}
              onChange={(e) =>
                setGoal({ ...goal, priority: Math.max(1, Math.min(5, parseInt(e.target.value) || 1)) })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Progress (%):</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full border border-gray-300 p-2 rounded"
              value={goal.progress}
              onChange={(e) =>
                setGoal({ ...goal, progress: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Goal Order:</label>
            <input
              type="number"
              className="w-full border border-gray-300 p-2 rounded"
              value={goal.order || 0}
              onChange={(e) => setGoal({ ...goal, order: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Start Date:</label>
            <input
              type="date"
              className="w-full border border-gray-300 p-2 rounded"
              value={goal.startDate}
              onChange={(e) => setGoal({ ...goal, startDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Due Date:</label>
            <input
              type="date"
              className="w-full border border-gray-300 p-2 rounded"
              value={goal.dueDate}
              onChange={(e) => setGoal({ ...goal, dueDate: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <label className="font-semibold">✅ Done:</label>
            <input
              type="checkbox"
              checked={goal.done}
              onChange={(e) => setGoal({ ...goal, done: e.target.checked })}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={updating}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {updating ? "Saving..." : "💾 Save Changes"}
          </button>

          {goal.hierarchy === 1 && (
            <button
              onClick={() => navigate(`/goals/new?parentGoalId=${goalId}`)}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              ➕ Add Step
            </button>
          )}

          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            🗑️ Delete Goal
          </button>
        </div>

        {/* Comments */}
        {goal.hierarchy === 1 && (
          <div className="mt-10 p-5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">💬 Comments</h2>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-3"
              placeholder="Write your comment..."
            />

            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Comment
            </button>

            {comments.length === 0 ? (
              <p className="text-gray-600 mt-4">No comments yet.</p>
            ) : (
              <ul className="space-y-2 mt-4">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="flex justify-between items-center border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    <div>
                      <p className="font-medium">{comment.userEmail}</p>
                      <p className="text-gray-600">{comment.text}</p>
                      <p className="text-gray-400 text-xs">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Sharing */}
        {goal.hierarchy === 1 && (
          <div className="mt-10 p-5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🔗 Sharing</h2>

            <div className="flex space-x-2 mb-4">
              <select
                value={selectedContactId}
                onChange={(e) => setSelectedContactId(e.target.value)}
                className="flex-grow border border-gray-300 rounded px-3 py-2"
              >
                <option value="">-- Select a contact --</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.email}
                  </option>
                ))}
              </select>
              <button
                onClick={handleShare}
                disabled={sharingLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {sharingLoading ? "Sharing..." : "Share"}
              </button>
            </div>

            {sharingError && <p className="text-red-600 mb-2">{sharingError}</p>}

            <h3 className="font-semibold mb-2">Shared With:</h3>
            {sharingUsers.length === 0 ? (
              <p className="text-gray-600">No users have access to this goal.</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {sharingUsers.map((user) => (
                  <li
                    key={user.id}
                    className="flex justify-between items-center border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    <span>{user.email}</span>
                    <button
                      onClick={() => handleUnshare(user.id)}
                      className="text-red-600 hover:underline"
                    >
                      Unshare
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>

  );
}
