# Async Task Manager

A small beginner-friendly Node.js backend for the **Backend Session 2: Async Task Management Backend with TypeScript** assignment. It uses TypeScript in strict mode and ESM modules, with no frontend, HTTP framework, database, or authentication.

## Assignment coverage

- Defines `User`, `Task`, and `TaskStatus` (`"pending" | "in-progress" | "completed"`) types.
- Creates, reads, lists, updates, and deletes tasks asynchronously.
- Validates runtime input: blank titles, invalid IDs, missing users, missing tasks, and invalid statuses.
- Rejects failed operations with meaningful errors without changing task data.
- Keeps data in memory and returns copies rather than mutable stored objects.
- Includes a runnable demo and isolated automated tests.

## Folder structure

```text
async-task-manager/
├── src/
│   ├── types.ts             # Task and User definitions
│   ├── data.ts              # In-memory storage and safe copies
│   ├── taskService.ts       # Async validation and task operations
│   ├── app.ts               # Runnable demonstration
│   └── taskService.test.ts  # Focused automated tests
├── package.json
├── tsconfig.json
└── .gitignore
```

## Run it in PowerShell

```powershell
cd "C:\Users\pc world\Documents\Codex\test lect\backend\async-task-manager"
npm install
npm run dev
npm run typecheck
npm test
npm run build
npm start
```

`npm run dev` runs the TypeScript entry point directly. `npm start` runs the JavaScript compiled into `dist/` by `npm run build`.

## Verification

The following commands were run successfully after implementation:

```powershell
npm run typecheck
npm test
npm run build
npm start
```

The test suite contains five focused tests for successful operations, validation failures, unchanged data after invalid operations, and protection from external mutation.

## How asynchronous work and errors are handled

Each service method returns a `Promise`. The service uses `async`/`await` and a short `setTimeout`-based delay to imitate non-blocking database I/O without using a real database. Invalid data causes the promise to reject with an `Error`; callers use `try`/`catch` (or `assert.rejects` in tests) to handle it. Runtime validation is still needed because TypeScript types do not validate values supplied while the program is running.

## Expected demo behavior

The demo creates a task for an existing user, fetches and lists it, changes its status, and deletes it. It then prints clear **Expected failure** messages for a blank title, a missing user, an invalid status, and a missing task. These expected errors are caught, so the demo continues running. A truly unexpected error sets a nonzero process exit code.

## Limitation

All users and tasks are stored only in memory. They are lost when the process exits.

## AI assistance disclosure

AI assistance generated the initial project structure, TypeScript implementation, tests, README, and verification workflow in response to the assignment requirements. The work should still be read and understood by the learner before submission; this disclosure does not claim a human review that did not occur.
