const { getAllUsers, deleteUser } = require("../utils");

const getUsersHandler = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "admin access required" });
  }

  const users = await getAllUsers();
  return res.json(users);
};

const deleteUserHandler = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "admin access required" });
  }

  const user = await deleteUser(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  return res.json({ msg: "user deleted" });
};

module.exports = {
  getUsersHandler,
  deleteUserHandler,
};
