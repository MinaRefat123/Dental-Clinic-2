// Script to ensure all users have required fields (name, email, password, role)
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./Models/User');

const REQUIRED_FIELDS = {
  name: 'Unknown',
  email: 'unknown@example.com',
  password: '$2b$10$replaceThisWithAValidHash', // Set a dummy hash if password missing
  role: 'user',
};

async function fixUsers() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const users = await User.find({});
  let updated = 0;

  for (const user of users) {
    let changed = false;
    for (const [field, fallback] of Object.entries(REQUIRED_FIELDS)) {
      if (!user[field]) {
        user[field] = fallback;
        changed = true;
      }
    }
    if (changed) {
      await user.save();
      updated++;
      console.log(`Updated user ${user._id}`);
    }
  }

  console.log(`Finished. Updated ${updated} users.`);
  mongoose.disconnect();
}

fixUsers().catch(err => {
  console.error('Error updating users:', err);
  mongoose.disconnect();
});
