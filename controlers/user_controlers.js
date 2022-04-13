const { Sequelize, Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const User = require('../models/user')
// const jwt = require('jsonwebtoken');

const sqlite3 = require('sqlite3');
const dbname = '../database.db'
const db = new sqlite3.Database(dbname, err => {
  if(err)
    throw err
  console.log(`Database stated on ${dbname}`)
});

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database.db'
});

// const User = sequelize.define('User', {
//     firstname: DataTypes.STRING,
//     lastname: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING(64),
//   });

exports.createUser = (async (res,req,next) =>  {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hashedPassword
        });
        res.send('ok');
      } catch(err) {
        console.log(err); 
        res.status(500).send(':(');
      }
      next()
})
