import type { Task, User } from "./types.js";

function copyUser(user: User): User {
  return { ...user };
}

function copyTask(task: Task): Task {
  return { ...task };
}

/**
 * A small in-memory data store. Every read and write returns a copy so callers
 * cannot mutate the objects that the store keeps internally.
 */
export class InMemoryTaskStore {
  private readonly users = new Map<string, User>();
  private readonly tasks = new Map<string, Task>();
  private taskNumber = 0;

  public constructor(users: readonly User[] = []) {
    for (const user of users) {
      this.users.set(user.id, copyUser(user));
    }
  }

  public getUser(id: string): User | undefined {
    const user = this.users.get(id);
    return user === undefined ? undefined : copyUser(user);
  }

  public createTask(task: Omit<Task, "id">): Task {
    this.taskNumber += 1;
    const createdTask: Task = { id: `task-${this.taskNumber}`, ...task };
    this.tasks.set(createdTask.id, copyTask(createdTask));
    return copyTask(createdTask);
  }

  public getTask(id: string): Task | undefined {
    const task = this.tasks.get(id);
    return task === undefined ? undefined : copyTask(task);
  }

  public getTasksByUserId(userId: string): Task[] {
    return [...this.tasks.values()]
      .filter((task) => task.userId === userId)
      .map(copyTask);
  }

  public replaceTask(task: Task): Task {
    this.tasks.set(task.id, copyTask(task));
    return copyTask(task);
  }

  public removeTask(id: string): Task | undefined {
    const task = this.tasks.get(id);
    if (task === undefined) {
      return undefined;
    }

    this.tasks.delete(id);
    return copyTask(task);
  }
}
