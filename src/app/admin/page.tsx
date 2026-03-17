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
    } catch (error) {
      const message = toReadableError(error, "Unable to load projects data.");
      setAdminDataError(message);
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
  if (loggedIn) {
    setAdminDataError(null);
    fetchMembers();
    fetchEvents();
    fetchProjects();
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
    try {
      await deleteDoc(doc(db, "team", id));
      fetchMembers();
    } catch (error) {
      setAdminDataError(toReadableError(error, "Unable to delete crew member."));
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
    try {
      await deleteProjectById(id);
      fetchProjects();
      if (projectEditingId === id) {
        resetProjectForm();
      }
    } catch (error) {
      const message = toReadableError(error, "Unable to delete project.");
      setAdminDataError(message);
      setProjectError(message);
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
          <button
          onClick={() => setActiveTab("projects")}
          className={`px-6 py-2 rounded-full border ${
          activeTab === "projects"
          ? "bg-crimson text-white border-crimson"
          : "border-white/20 text-white/60"
        }`} >
          Projects
          </button>
          </div>

        {adminDataError && (
          <div className="mt-6 rounded-lg border border-crimson/50 bg-crimson/10 px-4 py-3 text-sm text-red-200">
            {adminDataError}
          </div>
        )}

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

{activeTab === "projects" && (
  <div className="grid md:grid-cols-2 gap-12">
    <GlassCard className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">
        {projectEditingId ? "Edit Project" : "Add Project"}
      </h2>

      <div className="space-y-4">
        <input
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
          placeholder="Title"
          value={projectForm.title}
          onChange={(e) =>
            setProjectForm({
              ...projectForm,
              title: e.target.value,
              slug: projectForm.slug || sanitizeSlug(e.target.value),
            })
          }
        />

        <input
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
          placeholder="Slug"
          value={projectForm.slug}
          onChange={(e) =>
            setProjectForm({ ...projectForm, slug: sanitizeSlug(e.target.value) })
          }
        />

        <textarea
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
          placeholder="Short description"
          value={projectForm.description}
          onChange={(e) =>
            setProjectForm({ ...projectForm, description: e.target.value })
          }
        />

        <textarea
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white min-h-[120px]"
          placeholder="Detailed content (optional)"
          value={projectForm.content}
          onChange={(e) =>
            setProjectForm({ ...projectForm, content: e.target.value })
          }
        />

        <input
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
          placeholder="Tags (comma separated)"
          value={projectForm.tags.join(", ")}
          onChange={(e) =>
            setProjectForm({
              ...projectForm,
              tags: e.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
            value={projectForm.size}
            onChange={(e) =>
              setProjectForm({ ...projectForm, size: e.target.value as ProjectSize })
            }
          >
            <option value="small">small</option>
            <option value="medium">medium</option>
            <option value="large">large</option>
            <option value="wide">wide</option>
            <option value="tall">tall</option>
          </select>

          <select
            className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
            value={projectForm.status}
            onChange={(e) =>
              setProjectForm({ ...projectForm, status: e.target.value as ProjectStatus })
            }
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
            placeholder="Display order"
            value={projectForm.order}
            onChange={(e) =>
              setProjectForm({ ...projectForm, order: Number(e.target.value) })
            }
          />

          <input
            className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
            placeholder="Image alt text"
            value={projectForm.image.alt}
            onChange={(e) =>
              setProjectForm({
                ...projectForm,
                image: { ...projectForm.image, alt: e.target.value },
              })
            }
          />
        </div>

        <input
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
          placeholder="Image URL (optional if uploading)"
          value={projectForm.image.url}
          onChange={(e) =>
            setProjectForm({
              ...projectForm,
              image: { ...projectForm.image, url: e.target.value },
            })
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setProjectImageFile(e.target.files?.[0] ?? null)
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
            placeholder="Live URL"
            value={projectForm.liveUrl || ""}
            onChange={(e) =>
              setProjectForm({ ...projectForm, liveUrl: e.target.value })
            }
          />
          <input
            className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
            placeholder="Repo URL"
            value={projectForm.repoUrl || ""}
            onChange={(e) =>
              setProjectForm({ ...projectForm, repoUrl: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
            placeholder="SEO title"
            value={projectForm.seo?.title || ""}
            onChange={(e) =>
              setProjectForm({
                ...projectForm,
                seo: { ...projectForm.seo, title: e.target.value },
              })
            }
          />
          <input
            className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
            placeholder="SEO OG image"
            value={projectForm.seo?.ogImage || ""}
            onChange={(e) =>
              setProjectForm({
                ...projectForm,
                seo: { ...projectForm.seo, ogImage: e.target.value },
              })
            }
          />
        </div>

        <textarea
          className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
          placeholder="SEO description"
          value={projectForm.seo?.description || ""}
          onChange={(e) =>
            setProjectForm({
              ...projectForm,
              seo: { ...projectForm.seo, description: e.target.value },
            })
          }
        />

        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={projectForm.featured}
            onChange={(e) =>
              setProjectForm({ ...projectForm, featured: e.target.checked })
            }
          />
          Featured project
        </label>

        {projectError && (
          <p className="text-sm text-crimson">{projectError}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleProjectSubmit}
            className="w-full bg-crimson py-3 rounded-lg font-bold hover:opacity-90 transition"
          >
            {projectEditingId ? "Update Project" : "Add Project"}
          </button>

          <button
            onClick={resetProjectForm}
            className="w-full border border-white/20 py-3 rounded-lg font-bold text-white/80 hover:text-white transition"
          >
            Clear
          </button>
        </div>
      </div>
    </GlassCard>

    <GlassCard className="p-8 max-h-[680px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Projects Database
      </h2>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex justify-between items-start border border-white/10 p-4 rounded-lg gap-4"
          >
            <div>
              <p className="font-bold text-white">
                {project.title}
              </p>
              <p className="text-xs text-white/60 mt-1">
                /{project.slug} • {project.status} • order {project.order}
              </p>
              <p className="text-sm text-white/50 mt-2 line-clamp-2">
                {project.description}
              </p>
            </div>

            <div className="space-x-2 whitespace-nowrap">
              <button
                onClick={() => handleProjectEdit(project)}
                className="px-4 py-1 border border-yellow-500 text-yellow-500 rounded-full hover:bg-yellow-500 hover:text-black transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleProjectDelete(project.id)}
                className="px-4 py-1 border border-crimson text-crimson rounded-full hover:bg-crimson hover:text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <p className="text-sm text-white/50">No projects found yet.</p>
        )}
      </div>
    </GlassCard>
  </div>
)}
      </div>
  );
}