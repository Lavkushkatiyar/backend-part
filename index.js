const express = require("express");
const {
  getUsersHandler,
  deleteUserHandler,
} = require("./src/controllers/admin_controller");

const authMiddleware = require("./src/middleware/auth_middleware.js");
const {
  updateTaskHandler,
  deleteTaskHandler,
  getTasksHandler,
  createTaskHandler,
} = require("./src/controllers/task_controller.js");

const {
  registerHandler,
  loginHandler,
} = require("./src/controllers/auth_controllers.js");

const app = express();
const PORT = 8000;

const AppDataSource = require("./src/db/data_source.js");
const seedAdmin = async () => {
  const repo = AppDataSource.getRepository("User");

  const existing = await repo.findOne({ where: { id: "1" } });

  if (!existing) {
    await repo.save({
      id: "1",
      password: "123",
      role: "admin",
    });
  }
};
AppDataSource.initialize()
  .then(async () => {
    await seedAdmin();
    console.log("database ready");
  })
  .catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app
  .route("/tasks/:id")
  .put(authMiddleware, updateTaskHandler)
  .delete(authMiddleware, deleteTaskHandler);

app.get("/tasks", authMiddleware, getTasksHandler);

app.get("/users", authMiddleware, getUsersHandler);

app.delete("/users/:id", authMiddleware, deleteUserHandler);

app.post("/tasks", authMiddleware, createTaskHandler);

app.get("/profile", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

app.route("/auth/register").post(registerHandler);
app.route("/auth/login").post(loginHandler);

if (require.main === module) {
  app.listen(PORT, () => console.log("serverStarted : ", PORT));
}

module.exports = app;
