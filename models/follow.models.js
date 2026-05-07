export default (sequelize, DataTypes) => sequelize.define(
  "follow",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    }
  },
  {
    tableName: "follows",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["followerId", "followingId"]
      }
    ],
    validate: {
      cannotFollowSelf() {
        if (this.followerId === this.followingId) {
          throw new Error("A user cannot follow themself");
        }
      }
    }
  }
);
