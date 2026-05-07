export default (sequelize, DataTypes) => sequelize.define(
  "feed",
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
    profId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "profs",
        key: "id"
      }
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "activity",
        key: "id"
      }
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    likeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "feed",
    timestamps: false
  }
);
