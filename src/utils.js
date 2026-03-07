const jwt = require("jsonwebtoken");
const JWT_SECRET = "1234";

const AppDataSource = require("./db/data_source");

const getUserRepo = () => AppDataSource.getRepository("User");
const getTaskRepo = () => AppDataSource.getRepository("Task");

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

const getAllUsers = async () => {
  const repo = getUserRepo();
  return repo.find();
};

const deleteUser = async (userId) => {
  const repo = getUserRepo();

  const user = await repo.findOne({ where: { id: userId } });

  if (!user) return null;

  await repo.delete({ id: userId });

  return true;
};

const createTask = async ({ title, description, userId }) => {
  const repo = getTaskRepo();

  const task = await repo.save({
    id: `task_${Date.now()}`,
    title,
    description,
    status: "pending",
    created_at: new Date(),
    user: { id: userId },
  });

  return task;
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

const getToken = ({ id, role }, time = "1h") => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: time,
  });
};

const addNewUser = async (id, password) => {
  const repo = getUserRepo();

  const existing = await repo.findOne({ where: { id } });
  if (existing) {
    throw new Error("user exists");
  }

  const user = await repo.save({
    id,
    password,
    role: "user",
  });

  return user.id;
};

const isValidUser = async (id, password) => {
  const repo = getUserRepo();

  return repo.findOne({
    where: { id, password },
  });
};

module.exports = {
  addNewUser,
  getAllUsers,
  deleteUser,
  getToken,
  isValidUser,
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
