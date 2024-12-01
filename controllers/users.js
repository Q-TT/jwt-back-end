// /controllers/users.js
const express = require('express');
const router = express.Router();
// Add bcrypt and the user model
const bcrypt = require('bcrypt');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

//this is constant, should NOT change
const SALT_LENGTH = 12;

//! signup route: POST - users/signup
router.post('/signup', async (req, res) => {
    try {
        // Check if the username is already taken
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.status(400).json({error:'Username already taken.'});
        }
        // Create a new user with hashed password
        const user = await User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        })
        
        //! do this so that users will NOT need to sign in again after signed up
        const token = jwt.sign(
            { username: user.username, _id: user._id },
            process.env.JWT_SECRET
          );
          res.status(201).json({ user, token })

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//! signin route: POST - users/signin
router.post('/signin', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
        const token = jwt.sign(
            //!payload
            { username: user.username, _id: user._id },
            //!secreate
            process.env.JWT_SECRET
          );
        res.status(200).json({ token });
      } else {
        res.json({ message: 'Invalid credentials.' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


module.exports = router;
