/**
 * Prepares the database.
 *
 *   node scripts/seed.js                   creates the admin account and sample posts
 *   node scripts/seed.js --no-sample       creates the admin account only
 *   node scripts/seed.js --reset-password  sets a new password for the admin
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env. Safe to run more than once.
 */
const fs = require('node:fs/promises');
const bcrypt = require('bcryptjs');
const { env } = require('../config/env');
const sequelize = require('../db');
const User = require('../models/user');
const Post = require('../models/post');
require('../models/comment');
require('../models/media');
require('../models/message');
require('../models/visit');
const { SAMPLE_POSTS } = require('./seedData');
const { slugify } = require('../utils/slugify');

const args = process.argv.slice(2);

async function seedAdmin() {
  const email = env.ADMIN_EMAIL.toLowerCase();
  const password = env.ADMIN_PASSWORD;
  const existing = await User.findOne({ where: { role: 'admin' } });

  if (existing && !args.includes('--reset-password')) {
    console.log(`Admin account already exists (${existing.email}).`);
    return;
  }
  if (!email || password.length < 10) {
    throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 10 characters in .env');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  if (existing) {
    await existing.update({ email, passwordHash });
    console.log(`Admin updated for ${email}.`);
  } else {
    await User.create({ email, name: 'Soham', role: 'admin', passwordHash });
    console.log(`Created admin account for ${email}.`);
  }
  console.log('Now delete the ADMIN_PASSWORD line from .env.');
}

async function uniqueSlug(title) {
  const base = slugify(title);
  let slug = base;
  let counter = 2;
  while (await Post.findOne({ where: { slug }, attributes: ['id'] })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

async function seedPosts() {
  if (args.includes('--no-sample')) return;
  if ((await Post.count()) > 0) {
    console.log('Posts already exist, skipping sample content.');
    return;
  }
  for (const sample of SAMPLE_POSTS) {
    await Post.create({
      category: null,
      price: '',
      readTime: '',
      content: '',
      metadata: { camera: '', lens: '', settings: '' },
      status: 'published',
      ...sample,
      slug: await uniqueSlug(sample.title),
      publishedAt: new Date(sample.publishedAt),
    });
  }
  console.log(`Added ${SAMPLE_POSTS.length} sample posts.`);
}

(async () => {
  await fs.mkdir(env.UPLOAD_DIR, { recursive: true });
  await sequelize.sync();
  await seedAdmin();
  await seedPosts();
  console.log('Done.');
  await sequelize.close();
})().catch(async (error) => {
  console.error(error.message || error);
  await sequelize.close().catch(() => {});
  process.exit(1);
});
