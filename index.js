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

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => console.log("serverStarted : ", PORT));
}
