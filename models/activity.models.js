export default (sequelize, DataTypes) => sequelize.define(
  "activity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ods_n: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ods",
        key: "n_ods"
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isMarked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    tableName: "activity",
    timestamps: false
  }
);
