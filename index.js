import express from 'express';
import mongoose from 'mongoose';
import {PORT, MONGODB_URI} from './config.js';
import User from './models/User.js';
mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.log('Error connecting to MongoDB: ', err.message);
    });

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  console.log(req.body.email);
  res.send('Hello there!');
});
app.post('/auth/register', (req, res) => {
  const userInstance = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  userInstance.save((err, user) => {
    if (err) {
      res.status(500).send({
        message: 'Error registering user ' + err.message,
      });
    } else {
      res.status(200).send({
        message: 'User created successfully',
      });
    }
  });
});
app.listen(PORT, (error) => {
  if (error) {
    console.log('Error: ', error);
  } else {
    console.log(`Server is listening on port ${PORT}`);
  }
});
