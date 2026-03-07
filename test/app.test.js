const request = require("supertest");
const app = require("../index.js");
describe("express app", () => {
  test("register succeeds with valid id and password", async () => {
    const userToSend = { id: "lavkush", password: "1234" };
    const res = await request(app).post("/auth/register").send(userToSend);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: userToSend.id, msg: "some msg" });
  });

  test("register fails when password is missing", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ id: "lavkush" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "body must contain only id and password",
    });
  });

  test("register fails when id is missing", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ password: "1234" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "body must contain only id and password",
    });
  });

  test("register fails when extra key is provided", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ id: "lavkush", password: "1234", email: "x@test.com" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "body must contain only id and password",
    });
  });

  test("register fails when body is empty", async () => {
    const res = await request(app).post("/auth/register").send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "body must contain only id and password",
    });
  });

  test("login succeeds with valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ id: "1", password: "123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("login fails with wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ id: "1", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "invalid credentials",
    });
  });

  test("login fails with unknown user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ id: "99", password: "123" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "invalid credentials",
    });
  });

  test("login fails when password is missing", async () => {
    const res = await request(app).post("/auth/login").send({ id: "1" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "body must contain only id and password",
    });
  });

  test("login fails when id is missing", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ password: "123" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "body must contain only id and password",
    });
  });

  test("login fails when extra field is provided", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ id: "1", password: "123", email: "x@test.com" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "body must contain only id and password",
    });
  });
  test("multiple users can register without conflict", async () => {
    const user1 = { id: "userA", password: "123" };
    const user2 = { id: "userB", password: "456" };

    const res1 = await request(app).post("/auth/register").send(user1);
    const res2 = await request(app).post("/auth/register").send(user2);

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    expect(res1.body.id).toBe("userA");
    expect(res2.body.id).toBe("userB");
  });
  test("registered user can login after registration", async () => {
    const newUser = { id: "user10", password: "pass123" };

    await request(app).post("/auth/register").send(newUser);

    const res = await request(app).post("/auth/login").send(newUser);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("profile route works with valid token", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ id: "1", password: "123" });

    const token = login.body.token;

    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe("1");
  });
  test("profile route works with valid token", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ id: "1", password: "123" });

    const token = login.body.token;

    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe("1");
  });
});
describe("task routes", () => {
  test("create task succeeds with valid token", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ id: "1", password: "123" });

    const token = login.body.token;

    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "learn jwt",
        description: "practice backend",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("learn jwt");
    expect(res.body.status).toBe("pending");
  });

  test("create task fails without token", async () => {
    const res = await request(app).post("/tasks").send({
      title: "learn jwt",
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "token required" });
  });

  test("create task fails when title is missing", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ id: "1", password: "123" });

    const token = login.body.token;

    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "missing title",
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "title is required",
    });
  });

  test("get tasks returns created tasks", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ id: "1", password: "123" });

    const token = login.body.token;

    await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "task one",
        description: "first task",
      });

    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("get tasks fails without token", async () => {
    const res = await request(app).get("/tasks");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "token required" });
  });
});
describe("task update and delete routes", () => {
  const loginAndGetToken = async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ id: "1", password: "123" });

    return res.body.token;
  };

  test("update task succeeds for owner", async () => {
    const token = await loginAndGetToken();

    const create = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "task to update",
        description: "update test",
      });

    const taskId = create.body.id;

    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "completed",
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("completed");
  });

  test("update task fails if task not found", async () => {
    const token = await loginAndGetToken();

    const res = await request(app)
      .put("/tasks/non_existing_task")
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "completed" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "task not found" });
  });

  test("delete task succeeds", async () => {
    const token = await loginAndGetToken();

    const create = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "task to delete",
        description: "delete test",
      });

    const taskId = create.body.id;

    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ msg: "task deleted" });
  });

  test("delete task fails when task does not exist", async () => {
    const token = await loginAndGetToken();

    const res = await request(app)
      .delete("/tasks/unknown_task")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "task not found" });
  });
});
describe("admin user routes", () => {
  const loginAndGetToken = async (id = "1", password = "123") => {
    const res = await request(app).post("/auth/login").send({ id, password });

    return res.body.token;
  };

  test("admin can get all users", async () => {
    const token = await loginAndGetToken();

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("non-admin cannot get users", async () => {
    await request(app)
      .post("/auth/register")
      .send({ id: "normalUser", password: "1234" });

    const token = await loginAndGetToken("normalUser", "1234");

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      error: "admin access required",
    });
  });

  test("admin can delete a user", async () => {
    await request(app)
      .post("/auth/register")
      .send({ id: "userToDelete", password: "1234" });

    const token = await loginAndGetToken();

    const res = await request(app)
      .delete("/users/userToDelete")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      msg: "user deleted",
    });
  });

  test("delete user fails if user not found", async () => {
    const token = await loginAndGetToken();

    const res = await request(app)
      .delete("/users/non_existing_user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "user not found",
    });
  });

  test("non-admin cannot delete user", async () => {
    await request(app)
      .post("/auth/register")
      .send({ id: "userA", password: "1234" });

    await request(app)
      .post("/auth/register")
      .send({ id: "userB", password: "1234" });

    const token = await loginAndGetToken("userA", "1234");

    const res = await request(app)
      .delete("/users/userB")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      error: "admin access required",
    });
  });
});
