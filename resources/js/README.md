# Frontend Structure

This project uses Laravel 12 with Inertia.js for the frontend. Below is the structure of the frontend code:

## Directory Structure

```
resources/js/
├── components/ - Reusable UI components
│   ├── appearance/ - Theme and appearance-related components
│   ├── common/ - Common/shared UI components
│   ├── layout/ - Layout components (headers, sidebars, etc.)
│   ├── navigation/ - Navigation components
│   ├── shared/ - Other shared components
│   ├── tree/ - Skill tree visualization components
│   ├── ui/ - Basic UI components
│   └── user/ - User-related components
├── pages/ - Inertia page components
│   ├── auth/ - Authentication pages
│   ├── settings/ - User settings pages
│   └── tree/ - Skill tree pages
├── layouts/ - Page layout templates
├── hooks/ - Custom React hooks
├── types/ - TypeScript type definitions
├── lib/ - Utility libraries
├── config/ - Configuration files
├── constants/ - Constant values and enums
├── services/ - API and service integrations
└── utils/ - Utility functions
```

## Naming Conventions

- **Files:**

    - React components: kebab-case (e.g., `git-tree.tsx`, `app-header.tsx`)
    - Utility files: kebab-case (e.g., `use-appearance.ts`)
    - Page index files: `index.tsx` for main page in a section

- **Directories:**

    - Component directories: lowercase (e.g., `layout/`, `common/`)
    - Utility directories: lowercase (e.g., `hooks/`, `utils/`)
    - Page directories: lowercase, by feature or section (e.g., `auth/`, `tree/`)

- **Components:**
    - Components should be named descriptively
    - Layout components should be prefixed with "app-" (e.g., `app-header`, `app-sidebar`)
    - UI components should be named after their purpose (e.g., `button`, `input`)

## Import Strategy

- Use relative imports for closely related files
- Use absolute imports (from the js root) for shared components and utilities

## Code Style

- Prefer functional components with hooks
- Use TypeScript for type safety
- Follow the existing structure when adding new components
