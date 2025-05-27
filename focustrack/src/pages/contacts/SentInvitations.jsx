import { useEffect, useState } from "react";

export default function SentInvitations() {
  const [sentInvitations, setSentInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchSentInvitations = () => {
    setLoading(true);
    setError("");
    fetch("http://localhost:8080/api/users/invitations/sent", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch sent invitations")))
      .then((data) => setSentInvitations(data))
      .catch(() => setError("Failed to load sent invitations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchSentInvitations();
  }, [token]);

  const handleCancelInvitation = async (invitationId) => {
    if (!window.confirm("Are you sure you want to cancel this invitation?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/users/invitations/${invitationId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Cancel failed");
      alert("Invitation cancelled");
      fetchSentInvitations();
    } catch {
      alert("Failed to cancel invitation");
    }
  };

  if (loading) return <p>Loading sent invitations...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (sentInvitations.length === 0)
    return <p>No sent invitations found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Sent Invitations</h2>
      <ul>
        {sentInvitations.map((inv) => (
          <li key={inv.id} className="flex justify-between items-center border-b py-2">
            <span>{inv.recipientEmail || inv.contactEmail || "Unknown Email"}</span>
            <button
              onClick={() => handleCancelInvitation(inv.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
