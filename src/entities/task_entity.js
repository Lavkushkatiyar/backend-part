const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Task",
  tableName: "tasks",
  columns: {
    id: {
      primary: true,
      type: "varchar",
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "varchar",
      nullable: true,
    },
    status: {
      type: "varchar",
    },
    created_at: {
      type: "datetime",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "userId",
      },
    },
  },
});
