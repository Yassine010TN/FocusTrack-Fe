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
      const response = await fetch("http://localhost:8080/api/users/contacts", {
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
    if (!token) return;
    fetchContacts();
  }, [token]);

  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    setDeletingId(contactId);
    try {
      const response = await fetch(`http://localhost:8080/api/users/contacts/${contactId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete contact");
      // Remove deleted contact from list
      setContacts(contacts.filter(c => c.id !== contactId));
    } catch (err) {
      alert(err.message || "Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-center p-4">Loading contacts...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  if (contacts.length === 0) return <p className="text-center p-4">No contacts found.</p>;

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">My Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{contact.email || contact.description || "Unnamed Contact"}</span>
            <button
              onClick={() => handleDelete(contact.id)}
              disabled={deletingId === contact.id}
              className="text-red-600 hover:text-red-800 disabled:opacity-50"
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
