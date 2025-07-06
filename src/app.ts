import express, { Application } from 'express';
import cors from 'cors';
import { readdirSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import db from './db/db';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

const connectDatabase = async (): Promise<void> => {
  try {
    await db(); 
    console.log('Database connected successfully');
  } catch (error: any) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
};

readdirSync(path.join(__dirname, 'routes')).forEach((route) => {
  try {
    const routePath = path.join(__dirname, 'routes', route);
    const importedRoute = require(routePath);
    app.use('/api/v1', importedRoute.default || importedRoute);
  } catch (error: any) {
    console.error(`Failed to load route ${route}:`, error.message);
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the API Personal Finance');
});

// const startServer = async (): Promise<void> => {
//   await connectDatabase();

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// };

// startServer();
