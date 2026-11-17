/** A person who can own tasks. */
export interface User {
  id: string;
  name: string;
  email: string;
}

/** The allowed lifecycle states for a task. */
export type TaskStatus = "pending" | "in-progress" | "completed";

/** A task stored by the application. */
export interface Task {
  id: string;
  title: string;
  userId: string;
  status: TaskStatus;
}

export interface CreateTaskInput {
  title: string;
  userId: string;
}
