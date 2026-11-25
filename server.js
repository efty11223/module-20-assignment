require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/db');

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  await connectDatabase();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Library API listening on port ${port}`));
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
