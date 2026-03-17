import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  PROJECT_SCHEMA_VERSION,
  type Project,
  type ProjectInput,
  type ProjectPatch,
  projectInputSchema,
  projectPatchSchema,
  sanitizeSlug,
  toProject,
} from "@/lib/projects/schema";

const projectsCollection = collection(db, "projects");

const parseProjectDocs = (docs: Array<{ id: string; data: () => unknown }>): Project[] => {
  return docs
    .map((item) => {
      try {
        return toProject(item.data(), item.id);
      } catch (error) {
        console.error("Invalid project document", item.id, error);
        return null;
      }
    })
    .filter((item): item is Project => item !== null);
};

export const getPublishedProjects = async (): Promise<Project[]> => {
  try {
    const publishedQuery = query(
      projectsCollection,
      where("status", "==", "published"),
      orderBy("order", "asc")
    );
    const snapshot = await getDocs(publishedQuery);
    return parseProjectDocs(snapshot.docs);
  } catch {
    const fallbackQuery = query(projectsCollection, orderBy("order", "asc"));
    const fallbackSnapshot = await getDocs(fallbackQuery);
    return parseProjectDocs(fallbackSnapshot.docs).filter((project) => project.status === "published");
  }
};

export const getAllProjectsForAdmin = async (): Promise<Project[]> => {
  const allQuery = query(projectsCollection, orderBy("order", "asc"));
  const snapshot = await getDocs(allQuery);
  return parseProjectDocs(snapshot.docs);
};

export const getProjectBySlug = async (
  slug: string,
  options?: { includeUnpublished?: boolean }
): Promise<Project | null> => {
  const normalizedSlug = sanitizeSlug(slug);
  const bySlugQuery = query(projectsCollection, where("slug", "==", normalizedSlug), limit(1));
  const snapshot = await getDocs(bySlugQuery);
  const first = snapshot.docs[0];

  if (!first) {
    return null;
  }

  try {
    const project = toProject(first.data(), first.id);
    if (!options?.includeUnpublished && project.status !== "published") {
      return null;
    }
    return project;
  } catch (error) {
    console.error("Invalid project slug result", normalizedSlug, error);
    return null;
  }
};

export const slugExists = async (slug: string, excludeId?: string): Promise<boolean> => {
  const normalizedSlug = sanitizeSlug(slug);
  const bySlugQuery = query(projectsCollection, where("slug", "==", normalizedSlug));
  const snapshot = await getDocs(bySlugQuery);
  return snapshot.docs.some((projectDoc) => projectDoc.id !== excludeId);
};

export const createProject = async (input: ProjectInput, createdBy?: string): Promise<string> => {
  const parsed = projectInputSchema.parse(input);
  const slug = sanitizeSlug(parsed.slug);
  const exists = await slugExists(slug);

  if (exists) {
    throw new Error("Slug already exists");
  }

  const now = Timestamp.now();
  const created = await addDoc(projectsCollection, {
    ...parsed,
    slug,
    createdAt: now,
    updatedAt: now,
    createdBy,
    _schemaVersion: PROJECT_SCHEMA_VERSION,
  });

  return created.id;
};

export const updateProject = async (id: string, patch: ProjectPatch): Promise<void> => {
  const parsed = projectPatchSchema.parse(patch);
  const nextSlug = parsed.slug ? sanitizeSlug(parsed.slug) : undefined;

  if (nextSlug) {
    const exists = await slugExists(nextSlug, id);
    if (exists) {
      throw new Error("Slug already exists");
    }
  }

  await updateDoc(doc(db, "projects", id), {
    ...parsed,
    ...(nextSlug ? { slug: nextSlug } : {}),
    updatedAt: Timestamp.now(),
  });
};

export const deleteProjectById = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "projects", id));
};