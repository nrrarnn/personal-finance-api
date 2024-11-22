const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const connectDatabase = async () => {
  try {
    await db(); 
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1); 
  }
};

readdirSync('./routes').forEach((route) => {
  try {
    app.use('/api/v1', require('./routes/' + route));
  } catch (error) {
    console.error(`Failed to load route ${route}:`, error.message);
  }
});

const startServer = async () => {
  await connectDatabase();

  const PORT = process.env.PORT || 3000; 
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
