import { useEffect, useState } from "react";

export default function ReceivedInvitations() {
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchReceivedInvitations = () => {
    setLoading(true);
    setError("");
    fetch("http://localhost:8080/api/users/invitations/received", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch received invitations")))
      .then((data) => setReceivedInvitations(data))
      .catch(() => setError("Failed to load received invitations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchReceivedInvitations();
  }, [token]);

  const handleRespond = async (invitationId, accept) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/invitations/${invitationId}?accept=${accept}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Response failed");
      alert(`Invitation ${accept ? "accepted" : "declined"}`);
      fetchReceivedInvitations();
    } catch {
      alert("Failed to respond to invitation");
    }
  };

  if (loading) return <p>Loading received invitations...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (receivedInvitations.length === 0)
    return <p>No received invitations found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Received Invitations</h2>
      <ul>
        {receivedInvitations.map((inv) => (
          <li key={inv.id} className="flex justify-between items-center border-b py-2">
            <span>{inv.senderEmail || inv.contactEmail || "Unknown Email"}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleRespond(inv.id, true)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleRespond(inv.id, false)}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
