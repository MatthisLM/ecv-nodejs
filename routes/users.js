const express = require('express');
const router = express.Router();
const User = require('../models/user');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', async function (req,res) {
  try{
    const newUser = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password
    })
    res.send('ok');
  } catch(error) {
    res.statuscode(500).send(':(');
  }
});

module.exports = router;
