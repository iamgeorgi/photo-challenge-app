import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT } from './config.js';
import usersController from './src/controllers/users-controller.js';
import contestsController from './src/controllers/contests-controller.js';
import authController from './src/controllers/auth-controller.js';
import passport from 'passport';
import jwtStrategy from './src/auth/strategy.js';

const app = express();

passport.use(jwtStrategy);
app.use(cors(), bodyParser.json());
app.use(passport.initialize());

app.use('/', authController);
app.use('/users', usersController);
app.use('/contests', contestsController);
app.use('/public', express.static('images'));

app.use((err, req, res, next) => {
  
  res.status(500).send({
    message: 'An unexpected error occurred, our developers are working hard to resolve it.',
  });
}),


  app.all('*', (req, res) => {
    res.status(404).send({ message: 'Resource not found' });
  });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));