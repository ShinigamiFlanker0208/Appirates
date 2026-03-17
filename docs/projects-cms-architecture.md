# Projects CMS Architecture

## System Flow

```mermaid
graph TB
    subgraph Client
        A[User] --> B[GlassNavbar]
        B --> C[/projects Index]
        C --> D[/projects/[slug] Detail]
        A --> E[Admin Login]
        E --> F[Admin Projects Tab]
    end

    subgraph Next.js App Router
        C --> G[ProjectsPage Client Fetch]
        D --> H[ProjectDetailPage Client Fetch]
        F --> I[AdminPage Client Mutations]
    end

    subgraph Firebase
        G --> J[(Firestore projects)]
        H --> J
        I --> J
        I --> K[Firebase Auth]
    end

    subgraph Media
        I --> L[Cloudinary Upload API]
        L --> I
    end
```

## UML-style Mapping

```mermaid
classDiagram
    class Project {
      +string id
      +string slug
      +string title
      +string description
      +string[] tags
      +ProjectSize size
      +ProjectImage image
      +ProjectStatus status
      +number order
      +boolean featured
      +string? liveUrl
      +string? repoUrl
      +number _schemaVersion
    }

    class ProjectImage {
      +string url
      +string alt
      +string? cloudinaryId
      +number? width
      +number? height
    }

    class ProjectsPage
    class ProjectDetailPage
    class AdminPage
    class ProjectService
    class Firestore

    ProjectsPage --> ProjectService : getPublishedProjects()
    ProjectDetailPage --> ProjectService : getProjectBySlug(slug)
    AdminPage --> ProjectService : create/update/delete
    ProjectService --> Firestore : projects collection
    Project --> ProjectImage
```
