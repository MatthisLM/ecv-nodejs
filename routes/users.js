if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const router = express.Router();
// const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sqlite3 = require('sqlite3');
const dbname = '../database.db'
const db = new sqlite3.Database(dbname, err => {
  if(err)
    throw err
  console.log(`Database stated on ${dbname}`)
});


const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database.db'
});


const User = sequelize.define('User', {
  firstname: DataTypes.STRING,
  lastname: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING(64),
});

const RefreshToken = sequelize.define('RefreshToken', {
  refreshToken: DataTypes.STRING(124),
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' })
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', async function (req,res) {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword
    });
    res.send('User created succefully');
  } catch(error) {
    console.log(error); 
    res.status(500).send('Something went wrong');
  }
});

router.post('/login', async function (req,res) {
  const user = await User.findOne({ where: { email: req.body.email } });
    if (user === null) {
      return res.status(400).send('User not found');
    }
    try {
      if(await bcrypt.compare(req.body.password, user.password))  {
        console.log(user)
        const username = `${user.firstname} ${user.lastname}`;
        const userLoged = { fullname: username };
        const accessToken = generateAccessToken(userLoged);
        const refreshToken = jwt.sign(userLoged, process.env.REFRESH_TOKEN_SECRET);
        await RefreshToken.create({
          refreshToken: refreshToken,
        }); 
        res.json({ name:username, accessToken: accessToken, refreshToken: refreshToken });
      } else {
        res.status(401).send('Wrong password.');
      }
    } catch(error) {
      console.log(error)
      res.status(500).send();
    }
});

module.exports = router;
