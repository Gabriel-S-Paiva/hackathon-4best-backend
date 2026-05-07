import express from 'express';
import sequelize from './models/db.config.js';
import usersRouter from './routes/users.routes.js';
import activitiesRouter from './routes/activities.routes.js';
import listsRouter from './routes/lists.routes.js';
import communitiesRouter from './routes/communities.routes.js';
import badgesRouter from './routes/badges.routes.js';
import profsRouter from './routes/profs.routes.js';
import feedRouter from './routes/feed.routes..js';
import tagsRouter from './routes/tags.routes.js';
import odsRouter from './routes/ods.routes.js';

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