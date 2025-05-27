import { useState } from 'react';

export default function SearchUser() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');
  const [sendError, setSendError] = useState('');

  const token = localStorage.getItem('token');

  const handleSearch = async () => {
    setResult(null);
    setError('');
    setSendSuccess('');
    setSendError('');
    try {
      const response = await fetch(`http://localhost:8080/api/users/search?email=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        setError('User not found');
        return;
      }
      const data = await response.json();
      setResult(data);
    } catch {
      setError('Error searching for user');
    }
  };

  const handleSendRequest = async () => {
    if (!result || !result.id) return;
    setSending(true);
    setSendSuccess('');
    setSendError('');
    try {
      const response = await fetch(`http://localhost:8080/api/users/invitations?contactId=${result.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to send request');
      }
      setSendSuccess('Friend request sent!');
    } catch (err) {
      setSendError(err.message || 'Failed to send request');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      {error && <p className="mt-2 text-red-500">{error}</p>}

      {result && (
        <div className="mt-4 p-4 border rounded shadow flex justify-between items-center">
          <div>
            <p><strong>Email:</strong> {result.email}</p>
            <p><strong>Description:</strong> {result.description || '-'}</p>
          </div>
          <div>
            <button
              onClick={handleSendRequest}
              disabled={sending}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              {sending ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>
      )}

      {sendSuccess && <p className="mt-2 text-green-600">{sendSuccess}</p>}
      {sendError && <p className="mt-2 text-red-600">{sendError}</p>}
    </div>
  );
}
