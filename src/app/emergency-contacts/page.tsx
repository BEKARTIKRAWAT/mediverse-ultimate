"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Phone, Mail, Plus, Trash2, Send, Edit, X, AlertTriangle } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export default function EmergencyContacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_emergency_${user.id}`);
    if (saved) setContacts(JSON.parse(saved));
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`mediverse_emergency_${user.id}`, JSON.stringify(contacts));
  }, [contacts, user]);

  const saveContact = () => {
    if (!form.name || !form.phone) return;
    if (editingId) {
      setContacts(contacts.map(c => c.id === editingId ? { ...c, ...form } : c));
    } else {
      setContacts([...contacts, { id: Date.now().toString(), ...form }]);
    }
    setForm({ name: "", phone: "", email: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const deleteContact = (id: string) => setContacts(contacts.filter(c => c.id !== id));
  const editContact = (c: Contact) => {
    setForm({ name: c.name, phone: c.phone, email: c.email || "" });
    setEditingId(c.id);
    setShowForm(true);
  };
  const cancelForm = () => {
    setForm({ name: "", phone: "", email: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const sendSMS = (phone: string, name: string) => {
    setSending(phone);
    const message = `🚨 EMERGENCY ALERT from ${user?.name} (Mediverse). Please check on me immediately.`;
    window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
    setTimeout(() => setSending(null), 1000);
  };

  const sendSOSToAll = () => {
    if (contacts.length === 0) {
      alert("No emergency contacts added yet. Add one first.");
      return;
    }
    contacts.forEach(c => sendSMS(c.phone, c.name));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800">Emergency Contacts</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", phone: "", email: "" }); }} className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Plus size={16} /> Add Contact
          </button>
        </div>

        {showForm && (
          <div className="border rounded-xl p-4 mb-4 bg-gray-50">
            <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-xl p-2 mb-2" />
            <input type="tel" placeholder="Phone Number (with country code)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border rounded-xl p-2 mb-2" />
            <input type="email" placeholder="Email (optional)" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded-xl p-2 mb-2" />
            <div className="flex gap-2">
              <button onClick={saveContact} className="bg-green-600 text-white px-4 py-2 rounded-xl">{editingId ? "Update" : "Save"}</button>
              <button onClick={cancelForm} className="bg-gray-300 px-4 py-2 rounded-xl">Cancel</button>
            </div>
          </div>
        )}

        {/* SOS to All button */}
        {contacts.length > 0 && (
          <button
            onClick={sendSOSToAll}
            className="w-full mb-4 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg transition"
          >
            <AlertTriangle size={18} /> SEND SOS TO ALL CONTACTS
          </button>
        )}

        {contacts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No emergency contacts added yet. Click "Add Contact".</p>
        ) : (
          <div className="space-y-3">
            {contacts.map(c => (
              <div key={c.id} className="flex justify-between items-center p-3 border rounded-xl bg-white shadow-sm">
                <div>
                  <p className="font-semibold text-gray-800">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.phone}</p>
                  {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => sendSMS(c.phone, c.name)} disabled={sending === c.phone} className="bg-blue-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center">
                    {sending === c.phone ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
                  </button>
                  <button onClick={() => editContact(c)} className="bg-gray-200 text-gray-700 p-2 rounded-full">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => deleteContact(c.id)} className="bg-red-100 text-red-600 p-2 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 text-center mt-6">⚠️ Tap the send button to open SMS app. In a real emergency, call emergency services first.</p>
      </div>
    </div>
  );
}
