const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./db');
const { env } = require('./config/env'); // also loads .env

// models: they must be loaded before sequelize.sync() so their tables get created
require('./models/home');
require('./models/organization');
require('./models/user');
require('./models/post');
require('./models/comment');
require('./models/media');
require('./models/message');
require('./models/visit');

// routes
const homeRoutes = require('./routes/homeRoutes');
const organizationRoutes = require('./routes/organizationroutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { pruneVisits } = require('./services/analyticsService');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', env.TRUST_PROXY);

// The browser must be allowed to send the login cookie, so a fixed origin is
// required (the wildcard that plain cors() uses does not work with cookies).
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '256kb' }));
app.use(cookieParser());

// Uploaded images
app.use(
  '/uploads',
  express.static(env.UPLOAD_DIR, {
    index: false,
    maxAge: '30d',
    setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff'),
  }),
);

// Your existing routes
app.use('/api', homeRoutes);
app.use('/api', organizationRoutes);

// New routes. Auth and admin come before the public routes.
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

sequelize
  .sync()
  .then(async () => {
    console.log('Database & tables ready');
    await pruneVisits().catch((error) => console.error('Could not prune old visits:', error));
    setInterval(() => pruneVisits().catch(() => {}), 24 * 60 * 60 * 1000).unref();

    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });
