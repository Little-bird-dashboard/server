const express = require('express');
const router = express.Router();
const queries = require('./queries.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

function validCoordinator(coordinator){
  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  const validEmail = typeof coordinator.email == 'string' && coordinator.email.trim() != '' && emailRegex.test(coordinator.email);
  const validPassword = typeof coordinator.password == 'string' && coordinator.password.trim() != '';
  return validEmail && validPassword;
}

router.put('/register', (req, res, next) => {
  if(validCoordinator(req.body)){
    queries.findCoordiantorIdByEmail(req.body.email)
      .then(coordId => {
        bcrypt.hash(req.body.password, salt)
          .then(hash => {
            let loginDetails = {
              password: hash,
            }
            queries.updatePassword(coordId.id, loginDetails)
              .then(response => {
                res.send('Password set!')
              })
          })
      })

  } else {
    res.setStatus(403)
    next(new Error('Invalid User'));
  }
})

router.post('/login', (req, res, next) => {
  if(validCoordinator(req.body)){
    //check to see if email is unique
    queries
      .findCoordiantorByEmail(req.body.email)
      .then(coordinator => {
        if(coordinator) {
          bcrypt
            .compare(req.body.password, coordinator.password)
            .then((result) => {
              if(result){
                let token = jwt.sign({id:coordinator.id, type:coordinator.stakeholder_type}, 'testKey')
                let stakeholder = {
                  token: token,
                  school: coordinator.school,
                  type: coordinator.stakeholder_type,
                  id: coordinator.stakeholder_id
                }
                res.json(stakeholder);
              } else {
                res.setStatus(403)
                next(new Error('Incorrect password'));
              }
            })
          //they were foumnd and login
        } else {
          //not found should signup
          res.setStatus(400)
          next(new Error('Email not found. Please create an account'));
        }
      });
  } else {
    res.setStatus(403)
    next(new Error('Invalid User Credentials'));
  }
});


module.exports = router;
