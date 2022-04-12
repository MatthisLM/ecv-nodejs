const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

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
    res.send('ok');
  } catch(error) {
    console.log(error);
    res.status(500).send(':(');
  }
});

module.exports = router;
