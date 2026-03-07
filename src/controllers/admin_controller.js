const { getAllUsers, deleteUser } = require("../utils");

const getUsersHandler = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "admin access required" });
  }

  const users = getAllUsers();
  return res.json(users);
};

const deleteUserHandler = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "admin access required" });
  }

  const user = deleteUser(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  return res.json({ msg: "user deleted" });
};

module.exports = {
  getUsersHandler,
  deleteUserHandler,
};
