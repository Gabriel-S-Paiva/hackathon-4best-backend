import { Sequelize, DataTypes } from "sequelize";
import odsModels from "./ods.models.js";
import activityModels from "./activity.models.js";
import tagsModels from "./tags.models.js";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

const ODS = odsModels(sequelize, DataTypes);
const Activity = activityModels(sequelize, DataTypes);
const Tag = tagsModels(sequelize, DataTypes);

Activity.belongsTo(ODS, {
  foreignKey: "ods_n",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT"
});
ODS.hasMany(Activity, {
  foreignKey: "ods_n"
});

Activity.belongsToMany(Tag, {
  through: { model: "activity_tag", timestamps: false },
  foreignKey: "activity_id",
  otherKey: "tag_id"
});
Tag.belongsToMany(Activity, {
  through: { model: "activity_tag", timestamps: false },
  foreignKey: "tag_id",
  otherKey: "activity_id"
});

export { ODS, Activity, Tag };
export default sequelize;