require("dotenv").config();

const express = require("express");

const AppDataSource = require("./src/db/data_source");
const { seedAdmin } = require("./src/utils");

const routes = require("./src/routes/routes");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

AppDataSource.initialize()
  .then(async () => {
    await seedAdmin();
    console.log("database ready");
  })
  .catch(console.error);

if (require.main === module) {
  app.listen(PORT, () => console.log("serverStarted :", PORT));
}

module.exports = app;
