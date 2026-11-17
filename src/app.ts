import { InMemoryTaskStore } from "./data.js";
import { TaskService } from "./taskService.js";

async function showExpectedFailure(label: string, operation: () => Promise<unknown>): Promise<void> {
  try {
    await operation();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.log(`Expected failure (${label}): ${message}`);
    return;
  }

  throw new Error(`Expected failure did not occur: ${label}`);
}

async function runDemo(): Promise<void> {
  const store = new InMemoryTaskStore([
    { id: "user-1", name: "Amina", email: "amina@example.com" },
    { id: "user-2", name: "Samir", email: "samir@example.com" },
  ]);
  const tasks = new TaskService(store);

  console.log("Async Task Manager demo\n");
  const createdTask = await tasks.createTask({ title: "Learn async/await", userId: "user-1" });
  console.log("Created:", createdTask);
  console.log("Fetched:", await tasks.getTaskById(createdTask.id));
  console.log("For user-1:", await tasks.listTasksForUser("user-1"));
  console.log("Updated:", await tasks.updateTaskStatus(createdTask.id, "in-progress"));
  console.log("Deleted:", await tasks.deleteTask(createdTask.id));

  console.log("\nFailure examples:");
  await showExpectedFailure("blank title", () => tasks.createTask({ title: "   ", userId: "user-1" }));
  await showExpectedFailure("missing user", () => tasks.createTask({ title: "Write tests", userId: "missing-user" }));
  await showExpectedFailure("invalid status", () => tasks.updateTaskStatus("task-999", "paused"));
  await showExpectedFailure("missing task", () => tasks.getTaskById(createdTask.id));
}

runDemo().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : "Unknown error";
  console.error("Unexpected demo error:", message);
  process.exitCode = 1;
});
