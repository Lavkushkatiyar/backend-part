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
  getTasks,
  createTask,
  addNewUser,
  getToken,
  isValidUser,
};
