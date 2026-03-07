const { getToken, isValidUser, addNewUser } = require("../utils");

const registerHandler = (req, res) => {
  const body = req.body;

  const keys = Object.keys(body);
  const allowedKeys = ["id", "password"];

  const isValid = keys.every((key) => allowedKeys.includes(key));

  if (!isValid || keys.length !== allowedKeys.length) {
    return res.status(400).json({
      error: "body must contain only id and password",
    });
  }

  const id = addNewUser(body.id, body.password);
  return res.json({ id, msg: "some msg" });
};

const loginHandler = (req, res) => {
  const body = req.body;

  const keys = Object.keys(body);
  const allowedKeys = ["id", "password"];

  const isValid = keys.every((key) => allowedKeys.includes(key));

  if (!isValid || keys.length !== allowedKeys.length) {
    return res.status(400).json({
      error: "body must contain only id and password",
    });
  }

  const { id, password } = body;
  const user = isValidUser(id, password);

  if (!user) {
    return res.status(401).json({
      error: "invalid credentials",
    });
  }

  const token = getToken(user);
  return res.json({ token });
};

module.exports = {
  registerHandler,
  loginHandler,
};
