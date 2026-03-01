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

  // Event State
  const [activeTab, setActiveTab] = useState<"crew" | "events">("crew");
  const [events, setEvents] = useState<any[]>([]);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    mentor: "",
    startDate: "",
    endDate: "",
  });
  const [eventImages, setEventImages] = useState<File[]>([]);

  const fetchMembers = async () => {
    const q = query(collection(db, "team"), orderBy("order"));
    const snapshot = await getDocs(q);
    const data: Member[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Member, "id">),
    }));
    setMembers(data);
  };

  const fetchEvents = async () => {
  const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  setEvents(data);
  };

  //Cloudinary- Events
  const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Appirates_Events");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/djrclqunq/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Cloudinary Error:", data);
    throw new Error("Image upload failed");
  }

  return data.secure_url;
};

  useEffect(() => {
  if (loggedIn) {
    fetchMembers();
    fetchEvents();
  }
}, [loggedIn]);
  
  // Crew Handlers
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

  // Event Handlers
  const handleEventSubmit = async () => {
  try {
    let imageUrls: string[] = [];

    if (eventImages.length > 0) {
      for (const image of eventImages) {
        const url = await uploadImageToCloudinary(image);
        imageUrls.push(url);
      }
    }

    await addDoc(collection(db, "events"), {
      ...eventForm,
      imageUrls,
      createdAt: new Date(),
    });

    setEventForm({
      title: "",
      description: "",
      mentor: "",
      startDate: "",
      endDate: "",
    });

    setEventImages([]); 
    fetchEvents();
  } catch (error) {
    console.error("Event Upload Error:", error);
  }
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
        <div className="flex gap-6 mt-6">
          <button
          onClick={() => setActiveTab("crew")}
          className={`px-6 py-2 rounded-full border ${
          activeTab === "crew"
          ? "bg-crimson text-white border-crimson"
          : "border-white/20 text-white/60"
        }`} >
          Crew
          </button>
          <button
          onClick={() => setActiveTab("events")}
          className={`px-6 py-2 rounded-full border ${
          activeTab === "events"
          ? "bg-crimson text-white border-crimson"
          : "border-white/20 text-white/60"
        }`} >
          Events
          </button>
          </div>

        {activeTab === "crew" && ( <div className="grid md:grid-cols-2 gap-12">
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
        )}
        {activeTab === "events" && (
  <div className="grid md:grid-cols-2 gap-12">

    {/* EVENT FORM */}
    <GlassCard className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Add Event
      </h2>

      <div className="space-y-4">

        <input
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
          placeholder="Title"
          value={eventForm.title}
          onChange={(e) =>
            setEventForm({ ...eventForm, title: e.target.value })
          }
        />

        <input
          type="date"
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white 
             [&::-webkit-calendar-picker-indicator]:invert"
          value={eventForm.startDate}
          onChange={(e) =>
          setEventForm({ ...eventForm, startDate: e.target.value })} />

        <input
          type="date"
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white 
             [&::-webkit-calendar-picker-indicator]:invert"
          value={eventForm.endDate}
          onChange={(e) =>
          setEventForm({ ...eventForm, endDate: e.target.value })}
          />


        <textarea
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
          placeholder="Description"
          value={eventForm.description}
          onChange={(e) =>
            setEventForm({ ...eventForm, description: e.target.value })
          }
        />

        <input
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
          placeholder="Mentor"
          value={eventForm.mentor}
          onChange={(e) =>
            setEventForm({ ...eventForm, mentor: e.target.value })
          }
        />

        <input
        type="file"
        multiple
        onChange={(e) =>
          setEventImages(
            e.target.files ? Array.from(e.target.files) : [])}
            />

        <button
          onClick={handleEventSubmit}
          className="w-full bg-crimson py-3 rounded-lg font-bold hover:opacity-90 transition"
        >
          Add Event
        </button>
      </div>
    </GlassCard>

    {/* EVENT LIST */}
    <GlassCard className="p-8 max-h-[600px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Events Database
      </h2>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex justify-between items-center border border-white/10 p-4 rounded-lg"
          >
            <div>
              <p className="font-bold text-white">
                {event.title}
              </p>
              <p className="text-sm text-white/50">
                {event.mentor}
              </p>
            </div>

            <button
              onClick={() =>
                deleteDoc(doc(db, "events", event.id)).then(fetchEvents)
              }
              className="px-4 py-1 border border-crimson text-crimson rounded-full hover:bg-crimson hover:text-white transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </GlassCard>

  </div>
)}
      </div>
  );
}