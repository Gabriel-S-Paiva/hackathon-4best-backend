export default (sequelize, DataTypes) => sequelize.define(
  "prof",
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
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "activity",
        key: "id"
      }
    },
    listItemId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "list_items",
        key: "id"
      }
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shareToFeed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "profs",
    timestamps: false
  }
);
