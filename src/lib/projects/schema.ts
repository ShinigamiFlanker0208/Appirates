import { z } from "zod";

export const PROJECT_SCHEMA_VERSION = 1;

export const projectSizeSchema = z.enum(["small", "medium", "large", "wide", "tall"]);
export const projectStatusSchema = z.enum(["draft", "published", "archived"]);

const projectImageObjectSchema = z.object({
  url: z.string().min(1),
  cloudinaryId: z.string().optional(),
  alt: z.string().default("Project image"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

const projectImageRawSchema = z.union([projectImageObjectSchema, z.string().min(1)]);

const projectRawSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().optional(),
  tags: z.array(z.string()).default([]),
  size: projectSizeSchema.default("small"),
  image: projectImageRawSchema,
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  status: projectStatusSchema.default("draft"),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  createdAt: z.unknown().optional(),
  updatedAt: z.unknown().optional(),
  createdBy: z.string().optional(),
  _schemaVersion: z.number().int().default(PROJECT_SCHEMA_VERSION),
});

export const projectInputSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().optional(),
  tags: z.array(z.string()).default([]),
  size: projectSizeSchema.default("small"),
  image: projectImageObjectSchema,
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  status: projectStatusSchema.default("draft"),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
});

export const projectPatchSchema = projectInputSchema.partial();

export type ProjectSize = z.infer<typeof projectSizeSchema>;
export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectPatch = z.infer<typeof projectPatchSchema>;

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content?: string;
  tags: string[];
  size: ProjectSize;
  image: {
    url: string;
    cloudinaryId?: string;
    alt: string;
    width?: number;
    height?: number;
  };
  featured: boolean;
  order: number;
  status: ProjectStatus;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  liveUrl?: string;
  repoUrl?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  createdBy?: string;
  _schemaVersion: number;
};

export const sanitizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const toProject = (raw: unknown, id: string): Project => {
  const parsed = projectRawSchema.parse({ ...(raw as object), id });
  const normalizedImage =
    typeof parsed.image === "string"
      ? {
          url: parsed.image,
          alt: parsed.title,
        }
      : parsed.image;

  return {
    id,
    slug: sanitizeSlug(parsed.slug),
    title: parsed.title,
    description: parsed.description,
    content: parsed.content,
    tags: parsed.tags,
    size: parsed.size,
    image: normalizedImage,
    featured: parsed.featured,
    order: parsed.order,
    status: parsed.status,
    seo: parsed.seo,
    liveUrl: parsed.liveUrl || undefined,
    repoUrl: parsed.repoUrl || undefined,
    createdAt: parsed.createdAt,
    updatedAt: parsed.updatedAt,
    createdBy: parsed.createdBy,
    _schemaVersion: parsed._schemaVersion,
  };
};