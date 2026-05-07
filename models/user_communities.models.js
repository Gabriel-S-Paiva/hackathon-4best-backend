export default (sequelize, DataTypes) => sequelize.define(
  "user_community",
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
    communityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "communities",
        key: "id"
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "member"
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "user_communities",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["userId", "communityId"]
      }
    ]
  }
);
