const AppDataSource = require("../db/data_source");

const getTaskRepo = () => AppDataSource.getRepository("Task");

const createTask = async ({ title, description, userId }) => {
  const repo = getTaskRepo();

  return repo.save({
    id: `task_${Date.now()}`,
    title,
    description,
    status: "pending",
    created_at: new Date(),
    user: { id: userId },
  });
};

const getTasks = async (user) => {
  const repo = getTaskRepo();

  if (user.role === "admin") {
    return repo.find({ relations: ["user"] });
  }

  return repo.find({
    where: { user: { id: user.id } },
  });
};

const updateTask = async (taskId, updates, user) => {
  const repo = getTaskRepo();

  const task = await repo.findOne({
    where: { id: taskId },
    relations: ["user"],
  });

  if (!task) return null;

  const isOwner = task.user.id === user.id;
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) return "forbidden";

  await repo.update({ id: taskId }, updates);

  return repo.findOne({ where: { id: taskId } });
};

const deleteTask = async (taskId, user) => {
  const repo = getTaskRepo();

  const task = await repo.findOne({
    where: { id: taskId },
    relations: ["user"],
  });

  if (!task) return null;

  const isOwner = task.user.id === user.id;
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) return "forbidden";

  await repo.delete({ id: taskId });

  return true;
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};