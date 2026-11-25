#!/usr/bin/env node
/**
 * Finds duplicate Users (same normalized email, or same username) and merges
 * them onto a single surviving "keeper" (the earliest-created of the group),
 * re-pointing every reference in League/Season/Team/TeamInstance/StatRecord/
 * StatUnitRecord/Post before deleting the duplicate documents. Post also
 * stores usernames as plain strings (not refs) in `username`, `comments[].username`,
 * and `likes[].username` - those get renamed to the keeper's username too.
 *
 * Dry-run by default - prints the plan without writing anything.
 * Pass --apply to actually perform the merge + delete.
 *
 * Usage:
 *   node scripts/mergeDuplicateUsers.js          # dry run
 *   node scripts/mergeDuplicateUsers.js --apply  # actually do it
 *
 * Back up the database before running with --apply - this is irreversible.
 */
const mongoose = require('mongoose');
const config = require('../config');
const User = require('../db/models/User');
const League = require('../db/models/League');
const Season = require('../db/models/Season');
const Team = require('../db/models/Team');
const TeamInstance = require('../db/models/TeamInstance');
const StatRecord = require('../db/models/StatRecord');
const StatUnitRecord = require('../db/models/StatUnitRecord');
const Post = require('../db/models/Post');

const APPLY = process.argv.includes('--apply');
const normalizeEmail = (email = '') => email.trim().toLowerCase();

function groupBy(users, keyFn) {
  const map = new Map();
  for (const user of users) {
    const key = keyFn(user);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(user);
  }
  return [...map.values()].filter((group) => group.length > 1);
}

// A user can be duplicated on email AND username at once - union those
// groups so each user is only merged once.
function unionGroups(groups) {
  const merged = [];
  for (const group of groups) {
    const ids = new Set(group.map((u) => String(u._id)));
    const existing = merged.find((g) => g.some((u) => ids.has(String(u._id))));
    if (existing) {
      const existingIds = new Set(existing.map((u) => String(u._id)));
      for (const u of group) if (!existingIds.has(String(u._id))) existing.push(u);
    } else {
      merged.push([...group]);
    }
  }
  return merged;
}

// Repoint a single ObjectId field (e.g. Team.createdBy, TeamInstance.captain, StatRecord.player).
async function reassignSingleRef(Model, field, dupeId, keeperId) {
  await Model.updateMany({ [field]: dupeId }, { $set: { [field]: keeperId } });
}

// Repoint an ObjectId array field (e.g. League.admins, Team.players) without
// creating duplicate entries if the keeper is already in the array.
async function reassignArrayRef(Model, field, dupeId, keeperId) {
  await Model.updateMany({ [field]: dupeId }, { $addToSet: { [field]: keeperId } });
  await Model.updateMany({ [field]: dupeId }, { $pull: { [field]: dupeId } });
}

async function renamePostUsernames(dupeUsername, keeperUsername) {
  if (!dupeUsername || !keeperUsername || dupeUsername === keeperUsername) return;

  await Post.updateMany({ username: dupeUsername }, { $set: { username: keeperUsername } });
  await Post.updateMany(
    { 'comments.username': dupeUsername },
    { $set: { 'comments.$[c].username': keeperUsername } },
    { arrayFilters: [{ 'c.username': dupeUsername }] }
  );
  await Post.updateMany(
    { 'likes.username': dupeUsername },
    { $set: { 'likes.$[l].username': keeperUsername } },
    { arrayFilters: [{ 'l.username': dupeUsername }] }
  );
}

async function mergeUser(dupe, keeper) {
  await reassignArrayRef(League, 'admins', dupe._id, keeper._id);
  await reassignArrayRef(League, 'players', dupe._id, keeper._id);
  await reassignArrayRef(Season, 'captains', dupe._id, keeper._id);
  await reassignArrayRef(Season, 'players', dupe._id, keeper._id);
  await reassignSingleRef(Team, 'createdBy', dupe._id, keeper._id);
  await reassignArrayRef(Team, 'admins', dupe._id, keeper._id);
  await reassignArrayRef(Team, 'players', dupe._id, keeper._id);
  await reassignSingleRef(TeamInstance, 'captain', dupe._id, keeper._id);
  await reassignArrayRef(TeamInstance, 'players', dupe._id, keeper._id);
  await reassignSingleRef(StatRecord, 'player', dupe._id, keeper._id);
  await reassignSingleRef(StatUnitRecord, 'player', dupe._id, keeper._id);
  await reassignSingleRef(Post, 'user', dupe._id, keeper._id);
  await renamePostUsernames(dupe.username, keeper.username);

  await User.deleteOne({ _id: dupe._id });
}

async function run() {
  await mongoose.connect(config.mongodb);

  const users = await User.find().lean();
  const emailGroups = groupBy(users, (u) => (u.email ? normalizeEmail(u.email) : null));
  const usernameGroups = groupBy(users, (u) => (u.username ? u.username.trim().toLowerCase() : null));
  const groups = unionGroups([...emailGroups, ...usernameGroups]);

  console.log(`Found ${groups.length} duplicate user group(s) across ${users.length} total users.`);

  for (const group of groups) {
    const sorted = [...group].sort((a, b) => a._id.getTimestamp() - b._id.getTimestamp());
    const [keeper, ...dupes] = sorted;

    console.log(`\nGroup (email=${keeper.email}, username=${keeper.username}):`);
    console.log(`  KEEP   ${keeper._id}  created=${keeper._id.getTimestamp().toISOString()}  authType=${keeper.authType}`);
    for (const dupe of dupes) {
      console.log(`  MERGE  ${dupe._id}  created=${dupe._id.getTimestamp().toISOString()}  authType=${dupe.authType}  -> ${keeper._id}`);
      if (APPLY) {
        await mergeUser(dupe, keeper);
      }
    }
  }

  console.log(APPLY ? '\nDone - duplicates merged and deleted.' : '\nDry run only. Re-run with --apply to perform the merge.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
