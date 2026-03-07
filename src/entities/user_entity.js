const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
    role: {
      type: "varchar",
    },
  },
  relations: {
    tasks: {
      type: "one-to-many",
      target: "Task",
      inverseSide: "user",
    },
  },
});
