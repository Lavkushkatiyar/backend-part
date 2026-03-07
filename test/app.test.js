const request = require("supertest");
const app = require("../index.js");
describe("express app", () => {
  test("GET / returns HTML with working text", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/does it working/i);
  });

  test("POST / accepts urlencoded form and echoes body", async () => {
    const form = { name: "lavkush", age: "21" };
    const res = await request(app).post("/").type("form").send(form);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ received: { name: "lavkush", age: "21" } });
  });

  test("POST / accepts JSON and echoes body", async () => {
    const payload = { foo: "bar", count: 3 };
    const res = await request(app).post("/").send(payload); // supertest will send JSON by default for objects

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ received: payload });
  });
  test("register succeeds with valid id and password", async () => {
    const userToSend = { id: "lavkush", password: "1234" };
    const res = await request(app)
      .post("/auth/register")
      .send(userToSend);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id:userToSend.id, msg: "some msg" });
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
});
