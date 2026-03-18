"use client";

import { useEffect, useRef, useState } from "react";
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
  writeBatch,
} from "firebase/firestore";
import { Reorder, useDragControls } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import {
  createProject,
  deleteProjectById,
  getAllProjectsForAdmin,
  updateProject,
} from "@/lib/projects/service";
import {
  sanitizeSlug,
  type Project,
  type ProjectInput,
  type ProjectSize,
  type ProjectStatus,
} from "@/lib/projects/schema";
import StormBackground from "@/components/StormBackground";

type Member = {
  id: string;
  name: string;
  role: string;
  category: string;
  order: number;
};

type CrewReorderItemProps = {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  onDragEnd: () => void;
};

function CrewReorderItem({ member, onEdit, onDelete, onDragEnd }: CrewReorderItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={member}
      onDragEnd={onDragEnd}
      layout="position"
      layoutScroll
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.02}
      transition={{ type: "spring", stiffness: 640, damping: 42, mass: 0.6 }}
      whileDrag={{
        scale: 1.015,
        zIndex: 20,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
      }}
      style={{ willChange: "transform" }}
      className="group flex justify-between items-center p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/20 hover:bg-zinc-900/50 hover:border-zinc-700 transition-colors duration-150 select-none"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={`Reorder ${member.name}`}
          onPointerDown={(event) => dragControls.start(event)}
          className="text-zinc-500 opacity-50 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
        </button>
        <div>
          <p className="font-medium text-sm text-zinc-100">{member.name}</p>
          <p className="text-xs text-zinc-500 mt-1">
            {member.role} <span className="mx-1.5 opacity-50">•</span> <span className="capitalize">{member.category}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onEdit(member)}
          className="text-xs px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
        >
          Edit
        </button>
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onDelete(member.id)}
          className="text-xs px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          Delete
        </button>
      </div>
    </Reorder.Item>
  );
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [members, setMembers] = useState<Member[]>([]);
  const latestMemberOrderRef = useRef<Member[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    category: "member",
    order: 1,
  });

  // Event State
  const [activeTab, setActiveTab] = useState<"crew" | "events" | "projects">("crew");
  const [events, setEvents] = useState<any[]>([]);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    mentor: "",
    startDate: "",
    endDate: "",
  });
  const [eventImages, setEventImages] = useState<File[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectEditingId, setProjectEditingId] = useState<string | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [adminDataError, setAdminDataError] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectInput>({
    title: "",
    slug: "",
    description: "",
    content: "",
    tags: [],
    size: "small",
    image: {
      url: "",
      alt: "",
    },
    featured: false,
    order: 0,
    status: "draft",
    seo: {
      title: "",
      description: "",
      ogImage: "",
    },
    liveUrl: "",
    repoUrl: "",
  });
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);

  const toReadableError = (error: unknown, fallback: string) => {
    const message = (error as { message?: string })?.message || "";
    if (message.toLowerCase().includes("missing or insufficient permissions")) {
      return "Missing or insufficient permissions. Verify your Firestore rules and signed-in account access.";
    }
    return message || fallback;
  };

  const fetchMembers = async () => {
    try {
      const q = query(collection(db, "team"), orderBy("order"));
      const snapshot = await getDocs(q);
      const data: Member[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Member, "id">),
      }));
      setMembers(data);
      latestMemberOrderRef.current = data;
    } catch (error) {
      setAdminDataError(toReadableError(error, "Unable to load crew data."));
    }
  };

  const fetchEvents = async () => {
    try {
      const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(data);
    } catch (error) {
      setAdminDataError(toReadableError(error, "Unable to load events data."));
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await getAllProjectsForAdmin();
      setProjects(data);
      setProjectError(null);
    } catch (error) {
      const message = toReadableError(error, "Unable to load projects data.");
      setProjectError(message);
    }
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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      setAdminDataError(null);
      fetchMembers();
      fetchEvents();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn && activeTab === "projects") {
      fetchProjects();
    }
  }, [loggedIn, activeTab]);
  
  // Crew Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
    } catch (error) {
      console.error("Login Error", error);
      alert("Failed to login. Please check your credentials.");
    }
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
      const newOrder = members.length;
      await addDoc(collection(db, "team"), { ...form, order: newOrder });
    }

    setForm({ name: "", role: "", category: "member", order: 1 });
    fetchMembers();
  };

  const handleReorder = (newOrder: Member[]) => {
    setMembers(newOrder);
    latestMemberOrderRef.current = newOrder;
  };

  const persistMemberOrder = async () => {
    const orderedMembers = latestMemberOrderRef.current;
    if (!orderedMembers.length) return;

    const hasChanges = orderedMembers.some((member, index) => member.order !== index);
    if (!hasChanges) return;

    try {
      const batch = writeBatch(db);
      orderedMembers.forEach((member, index) => {
        if (member.order === index) return;
        const docRef = doc(db, "team", member.id);
        batch.update(docRef, { order: index });
      });
      await batch.commit();
      setMembers((prev) => prev.map((member, index) => ({ ...member, order: index })));
      latestMemberOrderRef.current = orderedMembers.map((member, index) => ({ ...member, order: index }));
    } catch (error) {
      console.error("Failed to reorder:", error);
      setAdminDataError("Failed to update member order.");
      fetchMembers();
    }
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
    if (confirm("Are you sure you want to delete this crew member?")) {
      try {
        await deleteDoc(doc(db, "team", id));
        fetchMembers();
      } catch (error) {
        setAdminDataError(toReadableError(error, "Unable to delete crew member."));
      }
    }
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
      setAdminDataError(toReadableError(error, "Unable to save event."));
      console.error("Event Upload Error:", error);
    }
  };

  const resetProjectForm = () => {
    setProjectEditingId(null);
    setProjectError(null);
    setProjectImageFile(null);
    setProjectForm({
      title: "",
      slug: "",
      description: "",
      content: "",
      tags: [],
      size: "small",
      image: {
        url: "",
        alt: "",
      },
      featured: false,
      order: 0,
      status: "draft",
      seo: {
        title: "",
        description: "",
        ogImage: "",
      },
      liveUrl: "",
      repoUrl: "",
    });
  };

  const handleProjectSubmit = async () => {
    setProjectError(null);
    try {
      let imageUrl = projectForm.image.url;

      if (projectImageFile) {
        imageUrl = await uploadImageToCloudinary(projectImageFile);
      }

      const payload: ProjectInput = {
        ...projectForm,
        slug: sanitizeSlug(projectForm.slug || projectForm.title),
        tags: projectForm.tags,
        image: {
          ...projectForm.image,
          url: imageUrl,
          alt: projectForm.image.alt || projectForm.title,
        },
      };

      if (projectEditingId) {
        await updateProject(projectEditingId, payload);
      } else {
        await createProject(payload, auth.currentUser?.uid);
      }

      resetProjectForm();
      fetchProjects();
    } catch (error: any) {
      setProjectError(toReadableError(error, "Unable to save project."));
    }
  };

  const handleProjectEdit = (project: Project) => {
    setProjectEditingId(project.id);
    setProjectError(null);
    setProjectImageFile(null);
    setProjectForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content || "",
      tags: project.tags,
      size: project.size,
      image: {
        url: project.image.url,
        alt: project.image.alt,
        cloudinaryId: project.image.cloudinaryId,
        width: project.image.width,
        height: project.image.height,
      },
      featured: project.featured,
      order: project.order,
      status: project.status,
      seo: {
        title: project.seo?.title || "",
        description: project.seo?.description || "",
        ogImage: project.seo?.ogImage || "",
      },
      liveUrl: project.liveUrl || "",
      repoUrl: project.repoUrl || "",
    });
  };

  const handleProjectDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProjectById(id);
        fetchProjects();
        if (projectEditingId === id) {
          resetProjectForm();
        }
      } catch (error) {
        const message = toReadableError(error, "Unable to delete project.");
        setProjectError(message);
      }
    }
  };

  const inputClass = "w-full p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-500";
  const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider";
  const primaryBtnClass = "w-full bg-white text-black py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const secondaryBtnClass = "w-full border border-zinc-800 text-zinc-300 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const cardClass = "bg-black border border-zinc-800/80 rounded-xl p-6 lg:p-8";

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent text-white px-4 relative">
        <StormBackground />
        <div className="relative z-10 w-full max-w-sm p-8 bg-black/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Admin System</h2>
            <p className="text-zinc-400 text-sm mt-2">Sign in to manage content</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                className={inputClass}
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={primaryBtnClass + " mt-4"}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-white/20 relative">
      <StormBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 mt-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
            <p className="text-zinc-400 text-sm mt-1">Manage platform content and settings.</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-800/50 pb-4">
          {[
            { id: "crew", label: "Crew Members" },
            { id: "events", label: "Events" },
            { id: "projects", label: "Projects" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {adminDataError && (
          <div className="mb-8 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/></svg>
            {adminDataError}
          </div>
        )}

        {/* Content Area */}
        {activeTab === "crew" && (
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
            {/* FORM */}
            <div className={cardClass}>
              <h2 className="text-lg font-semibold mb-6 text-white">
                {editingId ? "Edit Crew Member" : "Add Crew Member"}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Jane Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Role</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Lead Developer"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    className={inputClass}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="faculty">Faculty</option>
                    <option value="core">Core</option>
                    <option value="member">Member</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-3">
                  <button onClick={handleSubmit} className={primaryBtnClass}>
                    {editingId ? "Save Changes" : "Create Member"}
                  </button>
                  {editingId && (
                    <button 
                      onClick={() => {
                        setEditingId(null);
                        setForm({ name: "", role: "", category: "member", order: 1 });
                      }} 
                      className={secondaryBtnClass}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* LIST */}
            <div className={`${cardClass} lg:sticky lg:top-8 max-h-[calc(100vh-6rem)] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Crew Directory</h2>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md">{members.length} members</span>
              </div>

              <div className="space-y-3">
                <Reorder.Group axis="y" values={members} onReorder={handleReorder} layoutScroll className="space-y-3">
                  {members.map((member) => (
                    <CrewReorderItem
                      key={member.id}
                      member={member}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onDragEnd={persistMemberOrder}
                    />
                  ))}
                </Reorder.Group>
                
                {members.length === 0 && (
                  <div className="text-center py-12 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl">
                    No crew members found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
            {/* EVENT FORM */}
            <div className={cardClass}>
              <h2 className="text-lg font-semibold mb-6 text-white">Add Event</h2>

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    className={inputClass}
                    placeholder="Event Name"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input
                      type="date"
                      className={`${inputClass} [&::-webkit-calendar-picker-indicator]:invert`}
                      value={eventForm.startDate}
                      onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input
                      type="date"
                      className={`${inputClass} [&::-webkit-calendar-picker-indicator]:invert`}
                      value={eventForm.endDate}
                      onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    className={`${inputClass} min-h-[100px] resize-y`}
                    placeholder="Provide details about the event..."
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Mentor / Speaker</label>
                  <input
                    className={inputClass}
                    placeholder="Name of the mentor"
                    value={eventForm.mentor}
                    onChange={(e) => setEventForm({ ...eventForm, mentor: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Images</label>
                  <input
                    type="file"
                    multiple
                    className={`${inputClass} file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer`}
                    onChange={(e) => setEventImages(e.target.files ? Array.from(e.target.files) : [])}
                  />
                </div>

                <div className="pt-2">
                  <button onClick={handleEventSubmit} className={primaryBtnClass}>
                    Create Event
                  </button>
                </div>
              </div>
            </div>

            {/* EVENT LIST */}
            <div className={`${cardClass} lg:sticky lg:top-8 max-h-[calc(100vh-6rem)] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Events Registry</h2>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md">{events.length} events</span>
              </div>

              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/20 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all gap-4">
                    <div>
                      <p className="font-medium text-sm text-zinc-100">{event.title}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Mentor: {event.mentor || 'None'}
                      </p>
                      {(event.startDate || event.endDate) && (
                         <p className="text-xs text-zinc-500 mt-1">
                            {event.startDate && <span>{event.startDate}</span>}
                            {event.startDate && event.endDate && <span className="mx-1">-</span>}
                            {event.endDate && <span>{event.endDate}</span>}
                         </p>
                      )}
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-auto">
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this event?")) {
                            deleteDoc(doc(db, "events", event.id)).then(fetchEvents)
                          }
                        }}
                        className="text-xs px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                
                {events.length === 0 && (
                  <div className="text-center py-12 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl">
                    No events scheduled.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
            <div className={cardClass}>
              <h2 className="text-lg font-semibold mb-6 text-white">
                {projectEditingId ? "Edit Project" : "Add Project"}
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      className={inputClass}
                      placeholder="Project Title"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({
                        ...projectForm,
                        title: e.target.value,
                        slug: projectForm.slug || sanitizeSlug(e.target.value),
                      })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Slug</label>
                    <input
                      className={inputClass}
                      placeholder="url-friendly-slug"
                      value={projectForm.slug}
                      onChange={(e) => setProjectForm({ ...projectForm, slug: sanitizeSlug(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Short Description</label>
                  <textarea
                    className={`${inputClass} min-h-[80px] resize-y`}
                    placeholder="Brief summary for cards"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Detailed Content</label>
                  <textarea
                    className={`${inputClass} min-h-[140px] resize-y font-mono text-xs`}
                    placeholder="Markdown or detailed text (optional)"
                    value={projectForm.content}
                    onChange={(e) => setProjectForm({ ...projectForm, content: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Tags</label>
                  <input
                    className={inputClass}
                    placeholder="react, nextjs, tailwind (comma separated)"
                    value={projectForm.tags.join(", ")}
                    onChange={(e) => setProjectForm({
                      ...projectForm,
                      tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean),
                    })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Card Size</label>
                    <select
                      className={inputClass}
                      value={projectForm.size}
                      onChange={(e) => setProjectForm({ ...projectForm, size: e.target.value as ProjectSize })}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="wide">Wide</option>
                      <option value="tall">Tall</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      className={inputClass}
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as ProjectStatus })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Display Order</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={projectForm.order}
                      onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5 bg-zinc-900 border border-zinc-700 rounded transition-colors group-hover:border-zinc-500">
                        <input
                          type="checkbox"
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                          checked={projectForm.featured}
                          onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                        />
                        {projectForm.featured && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-zinc-300 select-none">Featured Project</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 pt-5 mt-5">
                  <h3 className="text-sm font-medium text-zinc-100 mb-4">Media & Links</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Cover Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className={`${inputClass} mb-2 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer`}
                        onChange={(e) => setProjectImageFile(e.target.files?.[0] ?? null)}
                      />
                      <input
                        className={inputClass}
                        placeholder="Or provide direct Image URL"
                        value={projectForm.image.url}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          image: { ...projectForm.image, url: e.target.value },
                        })}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Image Alt Text</label>
                      <input
                        className={inputClass}
                        placeholder="Describe the image for accessibility"
                        value={projectForm.image.alt}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          image: { ...projectForm.image, alt: e.target.value },
                        })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Live URL</label>
                        <input
                          className={inputClass}
                          placeholder="https://..."
                          value={projectForm.liveUrl || ""}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Repository URL</label>
                        <input
                          className={inputClass}
                          placeholder="https://github.com/..."
                          value={projectForm.repoUrl || ""}
                          onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 pt-5 mt-5">
                  <h3 className="text-sm font-medium text-zinc-100 mb-4">SEO Metadata</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>SEO Title</label>
                        <input
                          className={inputClass}
                          placeholder="Optimal title for search"
                          value={projectForm.seo?.title || ""}
                          onChange={(e) => setProjectForm({
                            ...projectForm,
                            seo: { ...projectForm.seo, title: e.target.value },
                          })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>OG Image URL</label>
                        <input
                          className={inputClass}
                          placeholder="https://..."
                          value={projectForm.seo?.ogImage || ""}
                          onChange={(e) => setProjectForm({
                            ...projectForm,
                            seo: { ...projectForm.seo, ogImage: e.target.value },
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>SEO Description</label>
                      <textarea
                        className={`${inputClass} min-h-[60px] resize-y`}
                        placeholder="Meta description"
                        value={projectForm.seo?.description || ""}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          seo: { ...projectForm.seo, description: e.target.value },
                        })}
                      />
                    </div>
                  </div>
                </div>

                {projectError && (
                  <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    {projectError}
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button onClick={handleProjectSubmit} className={primaryBtnClass}>
                    {projectEditingId ? "Save Changes" : "Create Project"}
                  </button>
                  <button onClick={resetProjectForm} className={secondaryBtnClass}>
                    Clear Form
                  </button>
                </div>
              </div>
            </div>

            <div className={`${cardClass} lg:sticky lg:top-8 max-h-[calc(100vh-6rem)] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Portfolio Index</h2>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md">{projects.length} projects</span>
              </div>

              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="group flex flex-col p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/20 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-zinc-100">{project.title}</p>
                          {project.featured && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 font-mono">
                          /{project.slug}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                           project.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                           project.status === 'draft' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' :
                           'bg-orange-500/10 text-orange-400 border-orange-500/20'
                         }`}>
                           {project.status}
                         </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-zinc-800/50">
                      <div className="flex gap-1.5">
                        {project.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleProjectEdit(project)}
                          className="text-xs px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleProjectDelete(project.id)}
                          className="text-xs px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="text-center py-12 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl">
                    No projects found in the database.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
