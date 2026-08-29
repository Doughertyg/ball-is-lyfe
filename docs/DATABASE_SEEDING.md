# 📊 Database Seeding & Test Data Guide

When developing locally or testing the dev environment, you'll often need sample data in your database. This guide covers strategies for populating MongoDB with test data.

## Options Comparison

| Approach | Setup Time | Maintainability | Realism | Best For |
|----------|---|---|---|---|
| **Seed Script** | 30 min | ⚠️ Medium | ⭐⭐⭐ Good | Initial setup, predictable data |
| **Faker.js** | 1-2 hours | ✅ Good | ⭐⭐ Fair | Varied data, larger datasets |
| **Fixtures (JSON)** | 1 hour | ✅ Good | ⭐⭐⭐ Good | Version control, reproducible |
| **Production Copy** | 15 min | ⚠️ Hard | ✅ Perfect | Debug production issues |

---

## Recommended: Seed Script + Fixtures Approach

This is the **recommended approach** for Ball is Lyfe. It combines:

1. **Seed Script** - TypeScript/Node script that runs on demand
2. **JSON Fixtures** - Version-controlled sample data
3. **Faker.js** - For generating realistic varied data

### Benefits

- ✅ Reproducible - Same seed produces same data
- ✅ Version controlled - Changes tracked in git
- ✅ Flexible - Can run full seed or partial
- ✅ Realistic - Can mix real data patterns with realistic variations
- ✅ Easy to update - Just edit JSON or script
- ✅ Team friendly - New developers run one command

---

## Implementation Guide

### 1. Project Structure

```
ball-is-lyfe/
├── scripts/
│   └── seed.js                    # Main seed script
├── seeds/
│   ├── fixtures/                  # Version-controlled sample data
│   │   ├── users.json
│   │   ├── leagues.json
│   │   ├── teams.json
│   │   └── games.json
│   └── seeders/                   # Optional: faker-based generators
│       └── generate-games.js
```

### 2. Seed Script (scripts/seed.js)

```javascript
/**
 * Database Seed Script
 * Populates local MongoDB with test data
 * 
 * Usage:
 *   npm run seed              # Full seed (clear + populate)
 *   npm run seed:users        # Seed only users
 *   npm run seed:clear        # Clear all data
 */

const mongoose = require('mongoose');
const config = require('../config');
const fs = require('fs');
const path = require('path');

// Import models
const User = require('../db/models/User');
const League = require('../db/models/League');
const Team = require('../db/models/Team');
const Game = require('../db/models/Game');

const FIXTURES_DIR = path.join(__dirname, '../seeds/fixtures');

/**
 * Load fixture file
 */
async function loadFixture(filename) {
  const filePath = path.join(FIXTURES_DIR, filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Clear all data
 */
async function clearData() {
  console.log('🗑️  Clearing database...');
  await User.deleteMany({});
  await League.deleteMany({});
  await Team.deleteMany({});
  await Game.deleteMany({});
  console.log('✅ Database cleared');
}

/**
 * Seed users
 */
async function seedUsers() {
  console.log('👤 Seeding users...');
  const users = await loadFixture('users.json');
  await User.insertMany(users);
  console.log(`✅ Seeded ${users.length} users`);
  return users;
}

/**
 * Seed leagues
 */
async function seedLeagues() {
  console.log('🏆 Seeding leagues...');
  const leagues = await loadFixture('leagues.json');
  await League.insertMany(leagues);
  console.log(`✅ Seeded ${leagues.length} leagues`);
  return leagues;
}

/**
 * Seed teams
 */
async function seedTeams() {
  console.log('🏀 Seeding teams...');
  const teams = await loadFixture('teams.json');
  await Team.insertMany(teams);
  console.log(`✅ Seeded ${teams.length} teams`);
  return teams;
}

/**
 * Seed games
 */
async function seedGames() {
  console.log('🎮 Seeding games...');
  const games = await loadFixture('games.json');
  await Game.insertMany(games);
  console.log(`✅ Seeded ${games.length} games`);
  return games;
}

/**
 * Main seed function
 */
async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // Get command line argument
    const command = process.argv[2] || 'full';

    switch (command) {
      case 'full':
        await clearData();
        await seedUsers();
        await seedLeagues();
        await seedTeams();
        await seedGames();
        console.log('\n✨ Full seed completed!');
        break;

      case 'clear':
        await clearData();
        break;

      case 'users':
        await seedUsers();
        break;

      case 'leagues':
        await seedLeagues();
        break;

      case 'teams':
        await seedTeams();
        break;

      case 'games':
        await seedGames();
        break;

      default:
        console.log('Unknown command:', command);
        console.log('Available commands: full, clear, users, leagues, teams, games');
    }

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
```

### 3. Add npm Scripts

In `package.json`:

```json
{
  "scripts": {
    "seed": "NODE_ENV=local node scripts/seed.js full",
    "seed:clear": "NODE_ENV=local node scripts/seed.js clear",
    "seed:users": "NODE_ENV=local node scripts/seed.js users",
    "seed:leagues": "NODE_ENV=local node scripts/seed.js leagues",
    "seed:teams": "NODE_ENV=local node scripts/seed.js teams",
    "seed:games": "NODE_ENV=local node scripts/seed.js games"
  }
}
```

### 4. Sample Fixture: seeds/fixtures/users.json

```json
[
  {
    "email": "admin@example.com",
    "password": "hashed_password_here",
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "email": "player1@example.com",
    "password": "hashed_password_here",
    "username": "player1",
    "firstName": "John",
    "lastName": "Smith",
    "role": "player",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "email": "player2@example.com",
    "password": "hashed_password_here",
    "username": "player2",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "player",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

---

## Advanced: Mix Fixtures with Faker

For more realistic varied data:

```javascript
// seeds/seeders/generate-teams.js
const faker = require('faker');
const fs = require('fs');
const path = require('path');

async function generateTeams(count = 20) {
  const teams = [];
  
  for (let i = 0; i < count; i++) {
    teams.push({
      name: faker.company.name() + ' ' + faker.word.noun(),
      description: faker.lorem.paragraph(),
      city: faker.address.city(),
      color: faker.internet.color(),
      createdAt: faker.date.past()
    });
  }

  // Save to fixture
  const filepath = path.join(__dirname, '../fixtures/teams.json');
  fs.writeFileSync(filepath, JSON.stringify(teams, null, 2));
  console.log(`Generated ${count} teams`);
}

generateTeams();
```

---

## Keeping Fixtures Updated

### When to Update Fixtures

- ✅ **DO** update when:
  - Data model changes
  - Need new test scenarios
  - Adding new features
  - Quarterly refresh for realism

- ❌ **DON'T** update when:
  - Just testing locally (run seed again instead)
  - Data is production-specific
  - Creating per-session test data

### Best Practices

1. **Keep fixtures minimal** - Just enough for testing
2. **Use realistic data** - Names, emails, values that make sense
3. **Version control** - Commit fixture changes
4. **Document** - Comment why specific test data exists
5. **Regular review** - Update quarterly as app evolves

---

## Using Production Data (⚠️ Carefully)

Sometimes you need real production data to debug issues:

```bash
# Export production data (MongoDB)
mongodump --uri "mongodb+srv://user:pass@prod-cluster.mongodb.net/ball-is-lyfe" \
  --out ./prod-backup

# Import to local
mongorestore --uri "mongodb://localhost:27017/ball-is-lyfe-dev" \
  ./prod-backup/ball-is-lyfe

# Or populate with anonymized copy
npm run seed:production-anonymized
```

**⚠️ IMPORTANT:**
- Never commit production data to git
- Anonymize PII (emails, passwords, personal info)
- Only use for debugging, not regular development
- Delete after use

---

## Why NOT Hardcoded Populate Script

A single hardcoded script that always populates the same data has drawbacks:

- ❌ Hard to modify without editing code
- ❌ Not version controlled (harder to track changes)
- ❌ Difficult to share variations with team
- ❌ Can get out of sync with data model
- ❌ No way to generate varied data
- ❌ Takes longer to update

**Fixtures + Seed Script solves all these issues!**

---

## Environment-Specific Recommendations

### Local Development

```bash
# First time setup
npm install
npm run seed          # Full seed with sample data

# During development
npm run seed          # Reseed when needed
```

### Dev Environment (When Set Up)

```bash
# On dev server, use production-like data
npm run seed:production-anonymized

# Or use smaller fixture set
npm run seed --environment=dev
```

### CI/CD Testing

```bash
# In CI pipeline, seed before running tests
npm run seed:test-minimal
```

---

## Troubleshooting

### "Seed failed: Connection refused"

Make sure MongoDB is running:
```bash
# Local MongoDB
brew services start mongodb-community

# Or Docker
docker ps  # check if running
```

### "E11000 duplicate key error"

Try clearing first:
```bash
npm run seed:clear
npm run seed
```

### "Fixture file not found"

Check the fixtures are in `seeds/fixtures/` directory:
```bash
ls seeds/fixtures/
```

---

## Summary

| Goal | Approach |
|------|----------|
| **Quick local setup** | `npm run seed` with fixtures |
| **Varied test data** | Fixtures + Faker.js generator |
| **Debug production issue** | Export + anonymize production data |
| **CI/CD testing** | Minimal test fixture set |
| **Team consistency** | Version-controlled fixtures |

The **recommended approach** for Ball is Lyfe is fixtures + seed script, as it provides the best balance of maintainability, reusability, and team collaboration.

---

## Next Steps

1. Create `scripts/seed.js` with the seed script above
2. Create `seeds/fixtures/` directory
3. Create JSON fixture files for each model
4. Add npm scripts to `package.json`
5. Test: `npm run seed`
6. Document any custom seeding needs for your team

Happy seeding! 🌱
