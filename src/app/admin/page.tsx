"use client";

import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { GlassCard } from "@/components/ui/GlassCard";

type Member = {
  id: string;
  name: string;
  role: string;
  category: string;
  order: number;
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [members, setMembers] = useState<Member[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    category: "member",
    order: 1,
  });

  const fetchMembers = async () => {
    const q = query(collection(db, "team"), orderBy("order"));
    const snapshot = await getDocs(q);
    const data: Member[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Member, "id">),
    }));
    setMembers(data);
  };

  useEffect(() => {
    if (loggedIn) fetchMembers();
  }, [loggedIn]);

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setLoggedIn(false);
  };

  const handleSubmit = async () => {
    if (editingId) {
      await updateDoc(doc(db, "team", editingId), form);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "team"), form);
    }

    setForm({ name: "", role: "", category: "member", order: 1 });
    fetchMembers();
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      role: member.role,
      category: member.category,
      order: member.order,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "team", id));
    fetchMembers();
  };

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <GlassCard className="w-96 p-8">
          <h2 className="text-3xl font-display font-bold text-metallic mb-6 text-center">
            Admin Access
          </h2>

          <div className="space-y-4">
            <input
              className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              className="w-full bg-crimson py-3 rounded-lg font-bold hover:opacity-90 transition"
            >
              Enter Control Deck
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">

        <div className="flex justify-between items-center mb-16">
          <h1 className="text-5xl font-display font-black text-metallic">
            Control Deck
          </h1>

          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-crimson rounded-full text-crimson hover:bg-crimson hover:text-white transition"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* FORM */}
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">
              {editingId ? "Edit Crew Member" : "Add Crew Member"}
            </h2>

            <div className="space-y-4">
              <input
                className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
                placeholder="Role"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              />

              <select
                className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="faculty">Faculty</option>
                <option value="core">Core</option>
                <option value="member">Member</option>
              </select>

              <input
                type="number"
                className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
                value={form.order}
                onChange={(e) =>
                  setForm({
                    ...form,
                    order: Number(e.target.value),
                  })
                }
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-crimson py-3 rounded-lg font-bold hover:opacity-90 transition"
              >
                {editingId ? "Update Member" : "Add Member"}
              </button>
            </div>
          </GlassCard>

          {/* MEMBER LIST */}
          <GlassCard className="p-8 max-h-[600px] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Crew Database
            </h2>

            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex justify-between items-center border border-white/10 p-4 rounded-lg"
                >
                  <div>
                    <p className="font-bold text-white">
                      {member.name}
                    </p>
                    <p className="text-sm text-white/50">
                      {member.role} • {member.category}
                    </p>
                  </div>

                  <div className="space-x-3">
                    <button
                      onClick={() => handleEdit(member)}
                      className="px-4 py-1 border border-yellow-500 text-yellow-500 rounded-full hover:bg-yellow-500 hover:text-black transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(member.id)}
                      className="px-4 py-1 border border-crimson text-crimson rounded-full hover:bg-crimson hover:text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
  );
}