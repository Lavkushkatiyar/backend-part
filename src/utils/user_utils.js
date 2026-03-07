const AppDataSource = require("../db/data_source");

const getUserRepo = () => AppDataSource.getRepository("User");

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

module.exports = {
  getAllUsers,
  deleteUser,
};
