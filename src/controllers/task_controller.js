const { updateTask, deleteTask } = require("../utils");

const { getTasks, createTask } = require("../utils");

const getTasksHandler = (req, res) => {
  const tasks = getTasks(req.user);

  return res.json(tasks);
};

const createTaskHandler = (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "title is required",
    });
  }

  const task = createTask({
    title,
    description,
    userId: req.user.id,
  });

  return res.status(201).json(task);
};

const updateTaskHandler = (req, res) => {
  const task = updateTask(req.params.id, req.body, req.user);

  if (task === null) {
    return res.status(404).json({ error: "task not found" });
  }

  if (task === "forbidden") {
    return res.status(403).json({ error: "not allowed" });
  }

  return res.json(task);
};

const deleteTaskHandler = (req, res) => {
  const task = deleteTask(req.params.id, req.user);

  if (task === null) {
    return res.status(404).json({ error: "task not found" });
  }

  if (task === "forbidden") {
    return res.status(403).json({ error: "not allowed" });
  }

  return res.json({ msg: "task deleted" });
};

module.exports = {
  getTasksHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
};
