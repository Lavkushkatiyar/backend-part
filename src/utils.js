const jwt = require("jsonwebtoken");
const JWT_SECRET = "1234"; // put it into env file

const tasks = [];

const users = [
  {
    id: "1",
    password: "123",
    role: "admin",
  },
];

const updateTask = (taskId, updates, user) => {
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return null;

  const isOwner = task.userId === user.id;
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) return "forbidden";

  if (updates.title !== undefined) task.title = updates.title;
  if (updates.description !== undefined) task.description = updates.description;
  if (updates.status !== undefined) task.status = updates.status;

  return task;
};
const deleteTask = (taskId, user) => {
  const index = tasks.findIndex((t) => t.id === taskId);

  if (index === -1) return null;

  const task = tasks[index];

  const isOwner = task.userId === user.id;
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) return "forbidden";

  tasks.splice(index, 1);

  return task;
};
const getAllUsers = () => users;

const deleteUser = (userId) => {
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) return null;

  const user = users[index];
  users.splice(index, 1);

  return user;
};

const createTask = ({ title, description, userId }) => {
  const task = {
    id: `task_${Date.now()}`,
    title,
    description,
    status: "pending",
    created_at: new Date().toISOString(),
    userId,
  };

  tasks.push(task);

  return task;
};

const getTasks = (user) =>
  user.role === "admin"
    ? tasks
    : tasks.filter((task) => task.userId === user.id);

const getToken = ({ id, role }, time = "1h") => {
  const token = jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: time,
  });
  return token;
};
const addNewUser = (id, password) => {
  // after register
  users.push({ id, password, role: "user" });
  return id;
};
const isValidUser = (id, password) =>
  users.find((user) => user.id === id && user.password === password);

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
