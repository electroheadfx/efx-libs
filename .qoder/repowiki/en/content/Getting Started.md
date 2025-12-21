# Getting Started

<cite>
**Referenced Files in This Document**   
- [package.json](file://package.json)
- [README.md](file://README.md)
- [biome.json](file://biome.json)
- [vite.config.ts](file://vite.config.ts)
- [tsconfig.json](file://tsconfig.json)
- [src/data/demo.punk-songs.ts](file://src/data/demo.punk-songs.ts)
- [src/routes/demo/start.ssr.data-only.tsx](file://src/routes/demo/start.ssr.data-only.tsx)
- [src/routes/index.tsx](file://src/routes/index.tsx)
- [src/routes/demo/api.names.ts](file://src/routes/demo/api.names.ts)
- [src/router.tsx](file://src/router.tsx)
</cite>

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup and Installation](#setup-and-installation)
3. [Development Scripts](#development-scripts)
4. [Testing and Code Quality](#testing-and-code-quality)
5. [Project Structure Overview](#project-structure-overview)
6. [Demo Files and Learning Resources](#demo-files-and-learning-resources)

## Prerequisites

Before beginning with this project, ensure you have the following foundational knowledge and tools installed:

- **Node.js**: Version 18 or higher is required to run the development server and build tools.
- **pnpm**: A fast, disk-space-efficient package manager for Node.js. Install it via `npm install -g pnpm`.
- **TypeScript**: This project is built using TypeScript, so familiarity with types, interfaces, and modern TypeScript syntax is essential.
- **React Fundamentals**: Understanding of React components, JSX, hooks (such as `useState`, `useEffect`), and component lifecycle.
- **Full-Stack Concepts**: Basic knowledge of server-side rendering (SSR), API routes, and client-server communication patterns.

These skills will help you navigate the codebase effectively and make meaningful contributions from the start.

**Section sources**
- [README.md](file://README.md#L1-L302)
- [tsconfig.json](file://tsconfig.json#L1-L29)

## Setup and Installation

To get the project up and running locally, follow these steps:

1. **Clone the repository** (if not already done) and navigate into the project directory.
2. **Install dependencies** using pnpm:

```bash
pnpm install
```

This command reads the `package.json` file and installs all listed dependencies, including development tools like Vite, Biome, and Vitest.

3. **Start the development server**:

```bash
pnpm start
```

This runs the `dev` script defined in `package.json`, launching the Vite development server on port 3000. You can access the application at `http://localhost:3000`.

The development environment includes hot module replacement (HMR), so changes to your code are reflected instantly in the browser.

**Section sources**
- [package.json](file://package.json#L5-L7)
- [README.md](file://README.md#L5-L10)

## Development Scripts

The project uses several npm scripts via pnpm to streamline development tasks. These are defined in the `scripts` section of `package.json`:

- `pnpm dev`: Starts the development server using Vite with hot reloading.
- `pnpm build`: Compiles the application for production, generating optimized static assets in the `dist` directory.
- `pnpm preview`: Serves the built production assets locally to test the final output.
- `pnpm test`: Runs unit tests using Vitest in headless mode.
- `pnpm format`: Automatically formats code using Biome’s built-in formatter.
- `pnpm lint`: Lints the codebase for potential errors and style issues.
- `pnpm check`: Performs a comprehensive check including type checking and linting.

Each script corresponds directly to tools configured in the project, ensuring consistency across environments.

**Section sources**
- [package.json](file://package.json#L5-L13)
- [vite.config.ts](file://vite.config.ts#L1-L24)

## Testing and Code Quality

### Running Tests with Vitest

This project uses [Vitest](https://vitest.dev/) as its testing framework. To execute tests:

```bash
pnpm test
```

Vitest provides a fast testing experience with support for mocking, coverage, and watch mode. Test files should follow the naming pattern `*.test.ts` or `*.test.tsx` and be colocated with the code they test.

### Code Formatting with Biome

Biome is used for both formatting and linting. To format your code:

```bash
pnpm format
```

Biome enforces consistent code style across the codebase using rules defined in `biome.json`. It supports zero-config formatting with opinionated defaults while allowing customization when needed.

### Linting Your Code

To run the linter:

```bash
pnpm lint
```

The linter checks for code quality issues, potential bugs, and adherence to best practices. It leverages Biome's built-in linting rules, which are enabled under the `"linter"` section in `biome.json`.

These tools work together to maintain high code quality and reduce manual code review overhead.

**Section sources**
- [package.json](file://package.json#L9-L12)
- [biome.json](file://biome.json#L1-L36)
- [README.md](file://README.md#L22-L42)

## Project Structure Overview

The project follows a modular structure centered around the `src` directory:

- `src/components/`: Reusable UI components (e.g., `Header.tsx`).
- `src/data/`: Data utilities and server functions (e.g., `demo.punk-songs.ts`).
- `src/routes/`: File-based routing setup powered by TanStack Router. Each file represents a route.
- `src/router.tsx`: Configures the router instance using the generated route tree.
- `src/styles.css`: Global styles, enhanced with Tailwind CSS.

The routing system is file-based: adding a new `.tsx` file in `src/routes` automatically creates a corresponding route. Layouts and nested routes are supported through special naming conventions (e.g., `__root.tsx` for root layout).

API endpoints are defined directly within route files using server handlers, enabling full-stack development without a separate backend.

**Section sources**
- [src/routes/index.tsx](file://src/routes/index.tsx#L1-L119)
- [src/router.tsx](file://src/router.tsx#L1-L16)
- [vite.config.ts](file://vite.config.ts#L1-L24)

## Demo Files and Learning Resources

Several demo files are included to help you learn and experiment with different features:

- `src/data/demo.punk-songs.ts`: Demonstrates server functions using `createServerFn`.
- `src/routes/demo/start.ssr.data-only.tsx`: Shows data-only SSR rendering.
- `src/routes/demo/start.ssr.full-ssr.tsx`: Illustrates full server-side rendering.
- `src/routes/demo/api.names.ts`: Defines an API route that returns JSON data.

These files are prefixed with `demo` and can be safely deleted once you’ve completed your learning phase. They serve as practical examples of how to implement key features like SSR, API routes, and data loading.

For further exploration, refer to the [TanStack documentation](https://tanstack.com) for detailed guides on Router, Query, Store, and other ecosystem libraries.

**Section sources**
- [src/data/demo.punk-songs.ts](file://src/data/demo.punk-songs.ts#L1-L14)
- [src/routes/demo/start.ssr.data-only.tsx](file://src/routes/demo/start.ssr.data-only.tsx#L1-L42)
- [src/routes/demo/api.names.ts](file://src/routes/demo/api.names.ts#L1-L11)
- [README.md](file://README.md#L295-L298)