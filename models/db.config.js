import { Sequelize, DataTypes } from "sequelize";
import odsModels from "./ods.models.js";
import activityModels from "./activity.models.js";
import tagsModels from "./tags.models.js";
import userModels from "./user.models.js";
import followModels from "./follow.models.js";
import listsModels from "./lists.models.js";
import listsItemModels from "./lists_item.models.js";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

const ODS = odsModels(sequelize, DataTypes);
const Activity = activityModels(sequelize, DataTypes);
const Tag = tagsModels(sequelize, DataTypes);
const User = userModels(sequelize, DataTypes);
const Follow = followModels(sequelize, DataTypes);
const List = listsModels(sequelize, DataTypes);
const ListItem = listsItemModels(sequelize, DataTypes);

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

User.belongsToMany(User, {
  as: "Following",
  through: Follow,
  foreignKey: "followerId",
  otherKey: "followingId"
});
User.belongsToMany(User, {
  as: "Followers",
  through: Follow,
  foreignKey: "followingId",
  otherKey: "followerId"
});

List.belongsTo(User, { foreignKey: "userId" });
User.hasMany(List, { foreignKey: "userId" });

List.belongsToMany(Activity, {
  through: ListItem,
  foreignKey: "listId",
  otherKey: "activityId"
});
Activity.belongsToMany(List, {
  through: ListItem,
  foreignKey: "activityId",
  otherKey: "listId"
});

List.hasMany(ListItem, { foreignKey: "listId" });
ListItem.belongsTo(List, { foreignKey: "listId" });
Activity.hasMany(ListItem, { foreignKey: "activityId" });
ListItem.belongsTo(Activity, { foreignKey: "activityId" });

export { ODS, Activity, Tag, User, Follow, List, ListItem };
export default sequelize;
