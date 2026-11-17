import { InMemoryTaskStore } from "./data.js";
import type { CreateTaskInput, Task, TaskStatus } from "./types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requireId(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === "pending" || value === "in-progress" || value === "completed";
}

function parseCreateTaskInput(value: unknown): CreateTaskInput {
  if (!isRecord(value)) {
    throw new Error("Task input must be an object with a title and userId.");
  }

  const title = value.title;
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error("Task title cannot be empty or whitespace only.");
  }

  return { title: title.trim(), userId: requireId(value.userId, "User ID") };
}

/** Business operations with simulated non-blocking database I/O. */
export class TaskService {
  public constructor(private readonly store: InMemoryTaskStore) {}

  private async simulateDatabaseDelay(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 10));
  }

  public async createTask(input: unknown): Promise<Task> {
    const parsedInput = parseCreateTaskInput(input);
    await this.simulateDatabaseDelay();

    if (this.store.getUser(parsedInput.userId) === undefined) {
      throw new Error(`User with ID "${parsedInput.userId}" was not found.`);
    }

    return this.store.createTask({ ...parsedInput, status: "pending" });
  }

  public async getTaskById(taskId: unknown): Promise<Task> {
    const id = requireId(taskId, "Task ID");
    await this.simulateDatabaseDelay();

    const task = this.store.getTask(id);
    if (task === undefined) {
      throw new Error(`Task with ID "${id}" was not found.`);
    }

    return task;
  }

  public async listTasksForUser(userId: unknown): Promise<Task[]> {
    const id = requireId(userId, "User ID");
    await this.simulateDatabaseDelay();

    if (this.store.getUser(id) === undefined) {
      throw new Error(`User with ID "${id}" was not found.`);
    }

    return this.store.getTasksByUserId(id);
  }

  public async updateTaskStatus(taskId: unknown, status: unknown): Promise<Task> {
    const id = requireId(taskId, "Task ID");
    if (!isTaskStatus(status)) {
      throw new Error("Task status must be pending, in-progress, or completed.");
    }

    await this.simulateDatabaseDelay();
    const task = this.store.getTask(id);
    if (task === undefined) {
      throw new Error(`Task with ID "${id}" was not found.`);
    }

    return this.store.replaceTask({ ...task, status });
  }

  public async deleteTask(taskId: unknown): Promise<Task> {
    const id = requireId(taskId, "Task ID");
    await this.simulateDatabaseDelay();

    const deletedTask = this.store.removeTask(id);
    if (deletedTask === undefined) {
      throw new Error(`Task with ID "${id}" was not found.`);
    }

    return deletedTask;
  }
}
