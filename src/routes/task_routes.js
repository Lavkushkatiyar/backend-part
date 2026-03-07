const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth_middleware");
const {
  updateTaskHandler,
  deleteTaskHandler,
} = require("../controllers/task_controller");

router
  .route("/tasks/:id")
  .put(authMiddleware, updateTaskHandler)
  .delete(authMiddleware, deleteTaskHandler);

module.exports = router;
