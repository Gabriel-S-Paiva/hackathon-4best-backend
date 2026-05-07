export default (sequelize, DataTypes) => sequelize.define(
  "ods",
  {
    n_ods: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        isInt: {
          msg: "n_ods must be an integer"
        },
        min: {
          args: 1,
          msg: "n_ods must be between 1 and 17"
        },
        max: {
          args: 17,
          msg: "n_ods must be between 1 and 17"
        }
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
    icon: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "ods",
    timestamps: false
  }
);
