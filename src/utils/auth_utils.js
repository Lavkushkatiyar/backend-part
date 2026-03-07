const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;

const AppDataSource = require("../db/data_source");

const getUserRepo = () => AppDataSource.getRepository("User");

const getToken = ({ id, role }, time = "1h") =>
  jwt.sign({ id, role }, JWT_SECRET, { expiresIn: time });

const addNewUser = async (id, password) => {
  const repo = getUserRepo();

  const existing = await repo.findOne({ where: { id } });
  if (existing) throw new Error("user exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await repo.save({
    id,
    password: hashedPassword,
    role: "user",
  });

  return user.id;
};

const isValidUser = async (id, password) => {
  const repo = getUserRepo();

  const user = await repo.findOne({ where: { id } });
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  return user;
};

const seedAdmin = async () => {
  const repo = getUserRepo();

  const existing = await repo.findOne({ where: { id: "1" } });

  if (!existing) {
    const hashedPassword = await bcrypt.hash("123", 10);

    await repo.save({
      id: "1",
      password: hashedPassword,
      role: "admin",
    });
  }
};

module.exports = {
  getToken,
  addNewUser,
  isValidUser,
  seedAdmin,
};
