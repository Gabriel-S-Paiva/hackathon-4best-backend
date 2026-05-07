export default (sequelize, DataTypes) => sequelize.define(
  "list_item",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "lists",
        key: "id"
      }
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "activity",
        key: "id"
      }
    }
  },
  {
    tableName: "list_items",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["listId", "activityId"]
      }
    ],
    hooks: {
      beforeCreate: async (item) => {
        const count = await item.constructor.count({ where: { listId: item.listId } });
        if (count >= 100) {
          throw new Error("A list cannot contain more than 100 activities.");
        }
      }
    }
  }
);
