const jwt = require("jsonwebtoken");
const JWT_SECRET = "1234"; // put it into env file
const getToken = ({ id, role }, time = "1h") => {
  const token = jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: time,
  });
  return token;
};

const users = [
  {
    id: "1",
    password: "123",
    role: "admin",
  },
];
const addNewUser = (id, password) => {
  // after register
  users.push({ id, password, role: "user" });
  return id;
};
const isValidUser = (id, password) =>
  users.find((user) => user.id === id && user.password === password);

module.exports = {
  addNewUser,
  getToken,
  isValidUser,
};
