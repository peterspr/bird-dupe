import express from 'express';
const app = express();

import 'dotenv/config';
import path from 'path';
import cors from 'cors';
import passport from 'passport';

const PORT = process.env.PORT || 3000;

import { Database } from './config/database';
console.log(process.env.MONGODB_URI);
const db = new Database(process.env.MONGODB_URI, {});

db.connect().catch((err) =>
  console.error("Error connecting to database:", err)
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../../client/bird-dupe-client/dist')))

import authRoutes from './routes/auth.routes';

app.use('/auth', authRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/bird-dupe-client/dist', 'index.html'));
});



// app.use(passport.initialize());
// import './config/authStrategies/azure-ad';

// const requireAuth = passport.authenticate('azuread-openidconnect', { scope: ['profile'] });
// import getUser from './controllers/user.controller';

// app.get('/signin', requireAuth, getUser);

// app.get('*', (req, res) => {
//     //res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
//     res.status(200).json(JSON.stringify(req));
// });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});