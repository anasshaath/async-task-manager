import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryTaskStore } from "./data.js";
import { TaskService } from "./taskService.js";

function createService(): TaskService {
  return new TaskService(
    new InMemoryTaskStore([{ id: "user-1", name: "Amina", email: "amina@example.com" }]),
  );
}

test("creates, reads, lists, updates, and deletes a task", async () => {
  const tasks = createService();
  const created = await tasks.createTask({ title: "  Finish assignment  ", userId: "user-1" });

  assert.deepEqual(created, {
    id: "task-1",
    title: "Finish assignment",
    userId: "user-1",
    status: "pending",
  });
  assert.deepEqual(await tasks.getTaskById(created.id), created);
  assert.deepEqual(await tasks.listTasksForUser("user-1"), [created]);

  const updated = await tasks.updateTaskStatus(created.id, "completed");
  assert.equal(updated.status, "completed");
  assert.deepEqual(await tasks.deleteTask(created.id), updated);
  await assert.rejects(tasks.getTaskById(created.id), /was not found/);
});

test("rejects invalid creates without adding tasks", async () => {
  const tasks = createService();

  await assert.rejects(tasks.createTask({ title: "   ", userId: "user-1" }), /cannot be empty/);
  await assert.rejects(tasks.createTask({ title: "Valid", userId: "missing" }), /User with ID "missing"/);
  assert.deepEqual(await tasks.listTasksForUser("user-1"), []);
});

test("rejects invalid updates without changing stored task data", async () => {
  const tasks = createService();
  const created = await tasks.createTask({ title: "Keep pending", userId: "user-1" });

  await assert.rejects(tasks.updateTaskStatus(created.id, "paused"), /must be pending/);
  await assert.rejects(tasks.updateTaskStatus("missing-task", "completed"), /was not found/);
  assert.equal((await tasks.getTaskById(created.id)).status, "pending");
});

test("rejects missing users and missing tasks", async () => {
  const tasks = createService();

  await assert.rejects(tasks.listTasksForUser("missing-user"), /User with ID "missing-user"/);
  await assert.rejects(tasks.deleteTask("missing-task"), /Task with ID "missing-task"/);
});

test("returned task objects are copies, not stored references", async () => {
  const tasks = createService();
  const created = await tasks.createTask({ title: "Do not mutate me", userId: "user-1" });
  created.title = "Changed outside the service";

  assert.equal((await tasks.getTaskById(created.id)).title, "Do not mutate me");

  const listedTask = (await tasks.listTasksForUser("user-1"))[0];
  assert.ok(listedTask);
  listedTask.title = "Changed list result";
  assert.equal((await tasks.getTaskById(created.id)).title, "Do not mutate me");
});
