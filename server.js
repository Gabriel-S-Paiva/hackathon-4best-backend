import express from 'express';
import sequelize from './models/db.config.js';
import usersRouter from './routes/users.js';
import activitiesRouter from './routes/activities.js';
import listsRouter from './routes/lists.js';
import communitiesRouter from './routes/communities.js';
import badgesRouter from './routes/badges.js';
import profsRouter from './routes/profs.js';
import feedRouter from './routes/feed.js';
import tagsRouter from './routes/tags.js';
import odsRouter from './routes/ods.js';

const app = express();
const port = process.env.PORT ?? 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/lists', listsRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/badges', badgesRouter);
app.use('/api/profs', profsRouter);
app.use('/api/feed', feedRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/ods', odsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to start server:", error);
    process.exit(1);
  });