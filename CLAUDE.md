# CLAUDE.md - AI Assistant Guide for GS-Frontend

## Project Overview

This is a **full-stack monorepo** containing a modern web application with separated Frontend and Backend codebases. The project is in early development stages with a cutting-edge technology stack.

**Project Type:** Full-stack web application
**Architecture:** Monorepo with Frontend/Backend separation
**Status:** Early development (bootstrapped, minimal integration)

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16.0.3 (App Router)
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5.x (strict mode)
- **Styling:** Tailwind CSS v4 (latest major version)
- **Fonts:** Geist Sans & Geist Mono (via next/font)
- **Build Tool:** Next.js built-in bundler
- **Node Version:** 20+

### Backend
- **Language:** Java 21
- **Build Tool:** Maven 4.0.0
- **Package:** org.example.Backend
- **Status:** Minimal setup (no web framework yet)
- **IDE:** IntelliJ IDEA configured

### Key Dependencies
- `react`: 19.2.0 (latest)
- `next`: 16.0.3 (latest)
- `@tailwindcss/postcss`: ^4 (Tailwind CSS v4)
- `eslint`: ^9 (flat config)
- `typescript`: ^5

---

## Directory Structure

```
/home/user/GS-Frontend/
├── Frontend/                          # Next.js Application
│   ├── public/                        # Static assets (SVG icons)
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── src/
│   │   └── app/                       # Next.js App Router (file-based routing)
│   │       ├── favicon.ico            # Site favicon
│   │       ├── globals.css            # Global styles + Tailwind imports
│   │       ├── layout.tsx             # Root layout (wraps all pages)
│   │       └── page.tsx               # Home page (/)
│   ├── .gitignore
│   ├── eslint.config.mjs              # ESLint flat config
│   ├── next.config.ts                 # Next.js configuration
│   ├── package.json                   # Dependencies & scripts
│   ├── package-lock.json              # Locked dependencies
│   ├── postcss.config.mjs             # PostCSS + Tailwind
│   ├── README.md
│   └── tsconfig.json                  # TypeScript config
│
└── Backend/
    └── Backend/                       # Java Maven Project
        ├── .idea/                     # IntelliJ IDEA settings
        ├── src/
        │   └── main/
        │       └── java/
        │           └── org/
        │               └── example/
        │                   └── Main.java    # Entry point
        ├── .gitignore
        └── pom.xml                    # Maven configuration
```

### Directory Purpose

**Frontend Directories:**
- `src/app/` - Next.js App Router pages and layouts (file-based routing)
- `public/` - Static assets served at root URL
- **NOT YET CREATED:** `src/components/`, `src/lib/`, `src/utils/`, `src/services/`

**Backend Directories:**
- `src/main/java/` - Java source code
- **NOT YET CREATED:** `src/test/java/`, API endpoints, services, controllers

---

## Development Workflows

### Frontend Commands

```bash
cd Frontend

# Development (with hot reload)
npm run dev                # Starts dev server at http://localhost:3000

# Production
npm run build              # Creates optimized production build (.next/)
npm run start              # Starts production server

# Code Quality
npm run lint               # Run ESLint checks
npx tsc --noEmit           # Type checking only (no files emitted)
```

### Backend Commands

```bash
cd Backend/Backend

# Compile
mvn compile

# Run
mvn exec:java -Dexec.mainClass="org.example.Main"

# Package
mvn package               # Creates JAR in target/

# Clean
mvn clean
```

### Git Workflow

**Important:** Development occurs on feature branches starting with `claude/`

```bash
# Check current branch
git status

# Create and switch to feature branch
git checkout -b claude/feature-name-sessionid

# Stage and commit
git add .
git commit -m "descriptive message"

# Push to remote
git push -u origin claude/feature-name-sessionid
```

**Branch Naming Convention:** `claude/<descriptive-name>-<session-id>`

---

## Code Conventions & Patterns

### Frontend Conventions

#### File Naming
- **Pages/Layouts:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **Components:** `PascalCase.tsx` (e.g., `Button.tsx`, `UserProfile.tsx`)
- **Utilities:** `camelCase.ts` (e.g., `formatDate.ts`, `apiClient.ts`)
- **Styles:** `kebab-case.css` or `globals.css`
- **Config:** `kebab-case.{ts,mjs,json}` (e.g., `next.config.ts`)

#### Code Style
- **Components:** Functional components with TypeScript
- **Exports:** Default export for pages/layouts, named exports for utilities
- **Props:** TypeScript interfaces or inline types
- **Async Components:** Supported (React Server Components)

```typescript
// Example component pattern
interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

#### TypeScript Patterns
- **Strict mode enabled** - all type checking rules enforced
- **Path alias:** Use `@/` for imports from `src/`
- **Type safety:** Prefer interfaces over types for object shapes
- **No implicit any:** Always define types explicitly

```typescript
// ✅ Good - using path alias
import { UserService } from '@/services/user';

// ❌ Avoid - relative paths for distant files
import { UserService } from '../../../services/user';
```

#### Styling Conventions
- **Tailwind CSS utility classes** (primary approach)
- **CSS variables** for theming (see `globals.css`)
- **Dark mode:** Use `dark:` prefixes with Tailwind
- **Responsive:** Use `sm:`, `md:`, `lg:`, `xl:` breakpoints

```tsx
// Example with Tailwind
<div className="flex items-center gap-4 p-6 bg-white dark:bg-gray-900">
  <h1 className="text-2xl font-bold">Title</h1>
</div>
```

### Backend Conventions

#### Java Style
- **Classes:** PascalCase (e.g., `UserService`, `MainController`)
- **Methods:** camelCase (e.g., `getUserById`, `processRequest`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Packages:** lowercase, dot-separated (e.g., `org.example.service`)

#### File Organization
- **One class per file** (Java standard)
- **File names match class names** (e.g., `UserService.java`)
- **Package structure mirrors directory structure**

---

## Key Configuration Files

### Frontend Configuration

#### `tsconfig.json`
- **Target:** ES2017
- **Strict mode:** Enabled
- **Path alias:** `@/*` → `./src/*`
- **Module resolution:** bundler (optimized for Next.js)
- **JSX:** react-jsx (React 19 transform)

#### `next.config.ts`
- Currently default configuration
- Modify for:
  - API proxying to backend
  - Environment variables
  - Custom webpack config
  - Image optimization settings

#### `eslint.config.mjs`
- **Format:** ESLint flat config (v9+)
- **Rules:** Next.js Core Web Vitals + TypeScript
- **Ignored:** `.next/`, `out/`, `build/`, `next-env.d.ts`

#### `postcss.config.mjs`
- Configured for Tailwind CSS v4
- Uses `@tailwindcss/postcss` plugin

### Backend Configuration

#### `pom.xml`
- **GroupId:** org.example
- **ArtifactId:** Backend
- **Java Version:** 21
- **Dependencies:** None yet (add Spring Boot, database drivers, etc.)

---

## Backend Integration

### Current State
⚠️ **No integration exists yet** - Frontend and Backend are completely separate.

**Backend Status:**
- Minimal Java application (just console output)
- No web server configured
- No REST API endpoints
- No Spring Boot or servlet framework

**Frontend Status:**
- No API calls implemented
- No HTTP client utilities
- No data fetching logic
- No API routes in Next.js

### Future Integration Pattern

When implementing backend integration:

1. **Backend Setup:**
   - Add Spring Boot to `pom.xml`
   - Create REST controllers in `src/main/java/org/example/controller/`
   - Configure CORS for frontend requests
   - Expose API at `http://localhost:8080/api/`

2. **Frontend Setup:**
   - Create API client in `src/services/api.ts`
   - Use native `fetch` API or add axios
   - Option: Create Next.js API routes in `src/app/api/`
   - Configure proxy in `next.config.ts` if needed

3. **Communication:**
   - RESTful JSON API
   - Content-Type: `application/json`
   - Handle CORS properly

```typescript
// Example API client pattern (not implemented yet)
export async function fetchUsers() {
  const response = await fetch('http://localhost:8080/api/users');
  return response.json();
}
```

---

## Testing & Quality Assurance

### Current State
⚠️ **No tests configured yet** - testing frameworks need to be added.

**Frontend:**
- ✅ ESLint configured (run with `npm run lint`)
- ✅ TypeScript strict mode enabled
- ❌ No test framework (Jest, Vitest, or Testing Library)
- ❌ No E2E tests (Playwright or Cypress)

**Backend:**
- ✅ Maven build system
- ❌ No JUnit or test directory (`src/test/java/`)
- ❌ No test cases

### Recommended Testing Setup

**Frontend Testing Stack:**
```bash
# Install testing libraries
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
npm install --save-dev @vitejs/plugin-react
npm install --save-dev @playwright/test  # For E2E tests
```

**Backend Testing Stack:**
```xml
<!-- Add to pom.xml -->
<dependency>
  <groupId>org.junit.jupiter</groupId>
  <artifactId>junit-jupiter</artifactId>
  <version>5.10.0</version>
  <scope>test</scope>
</dependency>
```

### Code Quality Checks

Before committing:
```bash
# Frontend
cd Frontend
npm run lint          # ESLint
npx tsc --noEmit      # Type check

# Backend
cd Backend/Backend
mvn compile           # Compilation check
```

---

## Common Development Tasks

### Adding a New Page (Frontend)

1. Create new directory in `src/app/`:
   ```bash
   mkdir -p src/app/about
   ```

2. Add `page.tsx`:
   ```typescript
   // src/app/about/page.tsx
   export default function AboutPage() {
     return <h1>About Us</h1>;
   }
   ```

3. Access at `http://localhost:3000/about`

### Adding a New Component (Frontend)

1. Create `src/components/` if it doesn't exist:
   ```bash
   mkdir -p src/components
   ```

2. Create component file:
   ```typescript
   // src/components/Button.tsx
   interface ButtonProps {
     label: string;
   }

   export default function Button({ label }: ButtonProps) {
     return <button>{label}</button>;
   }
   ```

3. Import using path alias:
   ```typescript
   import Button from '@/components/Button';
   ```

### Adding API Utilities (Frontend)

1. Create services directory:
   ```bash
   mkdir -p src/services
   ```

2. Create API client:
   ```typescript
   // src/services/api.ts
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

   export async function apiGet<T>(endpoint: string): Promise<T> {
     const response = await fetch(`${API_BASE_URL}${endpoint}`);
     if (!response.ok) throw new Error(`API Error: ${response.status}`);
     return response.json();
   }
   ```

### Adding Backend REST API

1. Add Spring Boot to `pom.xml`
2. Create controller:
   ```java
   // src/main/java/org/example/controller/UserController.java
   package org.example.controller;

   import org.springframework.web.bind.annotation.*;

   @RestController
   @RequestMapping("/api/users")
   public class UserController {
       @GetMapping
       public List<User> getUsers() {
           // Implementation
       }
   }
   ```

### Environment Variables

**Frontend:**
- Create `.env.local` (not committed)
- Prefix with `NEXT_PUBLIC_` for client-side access
- Access via `process.env.NEXT_PUBLIC_VAR_NAME`

**Backend:**
- Use `application.properties` or `application.yml`
- Access via `@Value("${property.name}")` in Spring Boot

---

## Important Notes for AI Assistants

### Project Status
- ✅ Modern stack with latest versions (Next.js 16, React 19, Java 21, Tailwind v4)
- ✅ Clean monorepo structure
- ⚠️ Early stage - minimal code, no tests, no API integration
- ⚠️ Backend has no web framework yet (consider Spring Boot)

### When Working on This Project

1. **Always check working directory:**
   - Frontend work: `cd Frontend`
   - Backend work: `cd Backend/Backend`

2. **Follow existing patterns:**
   - App Router conventions for pages
   - TypeScript strict mode compliance
   - Tailwind CSS for styling

3. **Consider structure needs:**
   - Suggest creating `components/`, `lib/`, `utils/`, `services/` as needed
   - Backend needs controller/service/repository layers

4. **Type safety is critical:**
   - Use TypeScript for all new frontend code
   - Define interfaces for props and API responses
   - No `any` types unless absolutely necessary

5. **Testing mindset:**
   - Suggest adding tests when implementing features
   - Consider test setup if building significant functionality

6. **Backend integration:**
   - If API work is needed, recommend Spring Boot setup first
   - Discuss CORS configuration
   - Plan API contract (endpoints, request/response shapes)

### Code Review Checklist

Before committing changes:
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Code follows naming conventions
- [ ] Path aliases used for imports (`@/...`)
- [ ] Dark mode support considered (if UI work)
- [ ] Responsive design applied (if UI work)
- [ ] Types defined for new interfaces/props
- [ ] No console.log statements left in code
- [ ] Git branch follows naming convention

### Recommended Next Steps for Development

Based on project maturity, consider:

1. **Add testing infrastructure** (highest priority)
2. **Implement Spring Boot backend** with REST API
3. **Create component library structure** (`components/`, `ui/`)
4. **Add state management** (Context, Zustand) if needed
5. **Setup environment variables** (.env files)
6. **Add authentication/authorization** layer
7. **Database integration** (PostgreSQL, MySQL, MongoDB)
8. **Error boundaries** and loading states (Frontend)
9. **API documentation** (Swagger/OpenAPI for Backend)
10. **CI/CD pipeline** (GitHub Actions, tests, linting)

---

## Resources & Documentation

- **Next.js Docs:** https://nextjs.org/docs
- **React 19 Docs:** https://react.dev
- **Tailwind CSS v4:** https://tailwindcss.com/docs
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **Spring Boot:** https://spring.io/projects/spring-boot
- **Maven Guide:** https://maven.apache.org/guides/

---

## Project Metadata

- **Repository:** GS-Frontend
- **Frontend Location:** `/home/user/GS-Frontend/Frontend`
- **Backend Location:** `/home/user/GS-Frontend/Backend/Backend`
- **Node Version:** 20+
- **Java Version:** 21
- **Last Updated:** 2025-11-14

---

*This document should be updated as the project evolves and new patterns emerge.*
