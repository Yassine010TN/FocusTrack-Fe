import { Outlet } from 'react-router-dom';

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">👥 Contacts</h1>
        <Outlet />
      </div>
    </div>
  );
}
