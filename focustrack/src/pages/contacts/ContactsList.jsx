import { useEffect, useState } from "react";

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://focustrack-production.up.railway.app/api/users/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError(err.message || "Error fetching contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchContacts();
  }, [token]);

  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    setDeletingId(contactId);
    try {
      const response = await fetch(`https://focustrack-production.up.railway.app/api/users/contacts/${contactId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete contact");
      setContacts(contacts.filter(c => c.id !== contactId));
    } catch (err) {
      alert(err.message || "Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading contacts...</p>;
  if (error)
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (contacts.length === 0)
    return <p className="text-center text-gray-600 mt-10">No contacts found.</p>;

  return (
    <div className="bg-white rounded-lg shadow-md max-w-xl mx-auto mt-6 p-6">
      <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
        My Contacts
      </h2>

      <ul className="space-y-3">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className="flex justify-between items-center bg-gray-50 border border-gray-300 rounded px-4 py-2"
          >
            <span className="text-gray-800 font-medium">
              {contact.email || contact.description || "Unnamed Contact"}
            </span>
            <button
              onClick={() => handleDelete(contact.id)}
              disabled={deletingId === contact.id}
              className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
              title="Delete Contact"
            >
              {deletingId === contact.id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
