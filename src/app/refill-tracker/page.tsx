"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Pill, AlertTriangle, CheckCircle, Calendar, Plus, Trash2, Edit } from "lucide-react";

interface RefillItem {
  id: string;
  name: string;
  refillDate: string; // YYYY-MM-DD
  dosage?: string;
}

export default function RefillTracker() {
  const { user } = useAuth();
  const [items, setItems] = useState<RefillItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", refillDate: "", dosage: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`mediverse_refills_${user?.id}`);
    if (saved) setItems(JSON.parse(saved));
    else {
      const demo = [
        { id: "1", name: "Aspirin", refillDate: "2026-05-25", dosage: "100mg" },
        { id: "2", name: "Metformin", refillDate: "2026-06-01", dosage: "500mg" },
      ];
      setItems(demo);
      localStorage.setItem(`mediverse_refills_${user?.id}`, JSON.stringify(demo));
    }
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`mediverse_refills_${user?.id}`, JSON.stringify(items));
  }, [items, user]);

  const addItem = () => {
    if (!newItem.name || !newItem.refillDate) return;
    if (editingId) {
      setItems(items.map(i => i.id === editingId ? { ...i, name: newItem.name, refillDate: newItem.refillDate, dosage: newItem.dosage } : i));
      setEditingId(null);
    } else {
      setItems([...items, { id: Date.now().toString(), ...newItem }]);
    }
    setNewItem({ name: "", refillDate: "", dosage: "" });
    setShowForm(false);
  };

  const deleteItem = (id: string) => setItems(items.filter(i => i.id !== id));
  const editItem = (item: RefillItem) => {
    setNewItem({ name: item.name, refillDate: item.refillDate, dosage: item.dosage || "" });
    setEditingId(item.id);
    setShowForm(true);
  };

  const getDaysLeft = (refillDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const refill = new Date(refillDate);
    const diff = Math.ceil((refill.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diff;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3"><Pill className="w-8 h-8 text-blue-600" /><h1 className="text-2xl font-bold">Medication Refill Tracker</h1></div>
          <button onClick={() => { setShowForm(true); setEditingId(null); setNewItem({ name: "", refillDate: "", dosage: "" }); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={16} /> Add</button>
        </div>

        {showForm && (
          <div className="border rounded-xl p-4 mb-4 bg-gray-50">
            <input type="text" placeholder="Medication name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full border rounded-xl p-2 mb-2" />
            <input type="date" value={newItem.refillDate} onChange={e => setNewItem({...newItem, refillDate: e.target.value})} className="w-full border rounded-xl p-2 mb-2" />
            <input type="text" placeholder="Dosage (optional)" value={newItem.dosage} onChange={e => setNewItem({...newItem, dosage: e.target.value})} className="w-full border rounded-xl p-2 mb-2" />
            <div className="flex gap-2"><button onClick={addItem} className="bg-green-600 text-white px-4 py-2 rounded-xl">{editingId ? "Update" : "Save"}</button><button onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded-xl">Cancel</button></div>
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No medications added. Click "Add" to start tracking refills.</p>
        ) : (
          <div className="space-y-3">
            {items.map(item => {
              const days = getDaysLeft(item.refillDate);
              let statusColor = "text-green-600", bgColor = "bg-green-50", borderColor = "border-green-200", icon = <CheckCircle size={18} className="text-green-500" />;
              if (days <= 3) { statusColor = "text-red-600"; bgColor = "bg-red-50"; borderColor = "border-red-200"; icon = <AlertTriangle size={18} className="text-red-500" />; }
              else if (days <= 7) { statusColor = "text-orange-600"; bgColor = "bg-orange-50"; borderColor = "border-orange-200"; icon = <AlertTriangle size={18} className="text-orange-500" />; }
              return (
                <div key={item.id} className={`flex justify-between items-center p-4 rounded-xl border ${borderColor} ${bgColor}`}>
                  <div><h3 className="font-semibold">{item.name}</h3>{item.dosage && <p className="text-sm text-gray-500">{item.dosage}</p>}<p className={`text-sm flex items-center gap-1 ${statusColor}`}>{icon} {days <= 0 ? "Refill overdue!" : days === 1 ? "1 day left" : `${days} days left`}</p></div>
                  <div className="flex gap-2"><button onClick={() => editItem(item)} className="text-blue-600"><Edit size={18} /></button><button onClick={() => deleteItem(item.id)} className="text-red-600"><Trash2 size={18} /></button></div>
                </div>
              );
            })}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-6 text-center">Set refill dates to get timely reminders. Data saved locally.</p>
      </div>
    </div>
  );
}



