export default (sequelize, DataTypes) => sequelize.define(
  "user_badge",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },
    badgeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "badges",
        key: "id"
      }
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: "user_badges",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["userId", "badgeId"]
      }
    ]
  }
);
