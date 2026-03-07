const { updateTask, deleteTask, getTasks, createTask } = require("../utils");

const getTasksHandler = async (req, res) => {
  const tasks = await getTasks(req.user);

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

const updateTaskHandler = async (req, res) => {
  const task = await updateTask(req.params.id, req.body, req.user);

  if (task === null) {
    return res.status(404).json({ error: "task not found" });
  }

  if (task === "forbidden") {
    return res.status(403).json({ error: "not allowed" });
  }

  return res.json(task);
};

const deleteTaskHandler = async (req, res) => {
  const task = await deleteTask(req.params.id, req.user);

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
