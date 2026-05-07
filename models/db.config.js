import { Sequelize, DataTypes } from "sequelize";
import odsModels from "./ods.models.js";
import activityModels from "./activity.models.js";
import tagsModels from "./tags.models.js";
import userModels from "./user.models.js";
import followModels from "./follow.models.js";
import badgesModels from "./badges.models.js";
import userBadgesModels from "./user_badges.models.js";
import comunityModels from "./community.models.js";
import userCommunitiesModels from "./user_communities.models.js";
import profModels from "./proof.models.js";
import feedModels from "./feed.models.js";
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
const Badge = badgesModels(sequelize, DataTypes);
const UserBadge = userBadgesModels(sequelize, DataTypes);
const Community = comunityModels(sequelize, DataTypes);
const UserCommunity = userCommunitiesModels(sequelize, DataTypes);
const Prof = profModels(sequelize, DataTypes);
const Feed = feedModels(sequelize, DataTypes);
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

Badge.belongsTo(ODS, {
  foreignKey: "ods_n"
});
ODS.hasMany(Badge, {
  foreignKey: "ods_n"
});

User.belongsToMany(Badge, {
  through: UserBadge,
  foreignKey: "userId",
  otherKey: "badgeId"
});
Badge.belongsToMany(User, {
  through: UserBadge,
  foreignKey: "badgeId",
  otherKey: "userId"
});

User.hasMany(UserBadge, { foreignKey: "userId" });
Badge.hasMany(UserBadge, { foreignKey: "badgeId" });
UserBadge.belongsTo(User, { foreignKey: "userId" });
UserBadge.belongsTo(Badge, { foreignKey: "badgeId" });

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

User.belongsToMany(Community, {
  through: UserCommunity,
  foreignKey: "userId",
  otherKey: "communityId"
});
Community.belongsToMany(User, {
  through: UserCommunity,
  foreignKey: "communityId",
  otherKey: "userId"
});

User.hasMany(UserCommunity, { foreignKey: "userId" });
Community.hasMany(UserCommunity, { foreignKey: "communityId" });
UserCommunity.belongsTo(User, { foreignKey: "userId" });
UserCommunity.belongsTo(Community, { foreignKey: "communityId" });

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

Prof.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Prof, { foreignKey: "userId" });
Prof.belongsTo(Activity, { foreignKey: "activityId" });
Activity.hasMany(Prof, { foreignKey: "activityId" });
Prof.belongsTo(ListItem, { foreignKey: "listItemId" });
ListItem.hasMany(Prof, { foreignKey: "listItemId" });

Feed.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Feed, { foreignKey: "userId" });
Feed.belongsTo(Prof, { foreignKey: "profId" });
Prof.hasOne(Feed, { foreignKey: "profId" });
Feed.belongsTo(Activity, { foreignKey: "activityId" });
Activity.hasMany(Feed, { foreignKey: "activityId" });

async function completeActivityWithBadge(userId, activityId) {
  const activity = await Activity.findByPk(activityId);
  if (!activity) {
    throw new Error("Activity not found");
  }

  if (!activity.isCompleted) {
    activity.isCompleted = true;
    await activity.save();
  }

  const badge = await Badge.findOne({ where: { ods_n: activity.ods_n } });
  if (!badge) {
    return { activity };
  }

  const [userBadge] = await UserBadge.findOrCreate({
    where: {
      userId,
      badgeId: badge.id
    },
    defaults: {
      count: 0
    }
  });

  userBadge.count += 1;
  await userBadge.save();

  return { activity, badge, userBadge };
}

export { ODS, Activity, Tag, Badge, User, Follow, Community, UserCommunity, List, ListItem, UserBadge, Prof, Feed, completeActivityWithBadge };
export default sequelize;
