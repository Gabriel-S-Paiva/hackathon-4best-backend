export default (sequelize, DataTypes) => sequelize.define(
  "badge",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    ods_n: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "ods",
        key: "n_ods"
      }
    }
  },
  {
    tableName: "badges",
    timestamps: false
  }
);
