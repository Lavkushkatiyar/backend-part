require("reflect-metadata");
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "dev.db",
  synchronize: true,
  logging: false,
  entities: [
    require("../entities/user_entity"),
    require("../entities/task_entity"),
  ],
});

module.exports = AppDataSource;
