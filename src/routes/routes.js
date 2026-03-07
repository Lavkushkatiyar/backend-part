const express = require("express");

const authMiddleware = require("../middleware/auth_middleware");

const {
  updateTaskHandler,
  deleteTaskHandler,
  getTasksHandler,
  createTaskHandler,
} = require("../controllers/task_controller");

const {
  getUsersHandler,
  deleteUserHandler,
} = require("../controllers/admin_controller");

const {
  registerHandler,
  loginHandler,
} = require("../controllers/auth_controllers");

const router = express.Router();

router
  .route("/tasks/:id")
  .put(authMiddleware, updateTaskHandler)
  .delete(authMiddleware, deleteTaskHandler);

router.get("/tasks", authMiddleware, getTasksHandler);

router.get("/users", authMiddleware, getUsersHandler);

router.delete("/users/:id", authMiddleware, deleteUserHandler);

router.post("/tasks", authMiddleware, createTaskHandler);

router.get("/profile", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

router.post("/auth/register", registerHandler);

router.post("/auth/login", loginHandler);

module.exports = router;
