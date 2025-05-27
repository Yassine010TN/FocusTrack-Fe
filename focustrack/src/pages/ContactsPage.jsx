import { Outlet } from 'react-router-dom';

export default function ContactsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Contacts</h1>
      <Outlet />
    </div>
  );
}
