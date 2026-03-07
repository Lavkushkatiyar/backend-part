const express = require("express");
const { getToken, isValidUser, addNewUser } = require("./src/utils.js");
const app = express();
const PORT = 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const postHandler = (req, res) => {
  const body = req.body;
  console.log(body);
  res.json({ received: body });
};

app.get("/", (request, res) => {
  const html = "<h1> does it working <h1/>";
  return res.send(html);
});

app.route("/").post(postHandler);

app.route("/auth/register").post((req, res) => {
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
  console.log(body);
  return res.json({ id, msg: "some msg" });
});

app.route("/auth/login").post((req, res) => {
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

  const token = getToken(user.id);
  return res.json({ token });
});
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => console.log("serverStarted : ", PORT));
}
