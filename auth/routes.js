const express = require('express');
const router = express.Router();
const queries = require('./queries.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function validCoordinator(coordinator){
  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  const validEmail = typeof coordinator.email == 'string' && coordinator.email.trim() != '' && emailRegex.test(coordinator.email);
  const validPassword = typeof coordinator.password == 'string' && coordinator.password.trim() != '';
  return validEmail && validPassword;
}

// router.post('/signup', (req, res, next) => {
//   if(validCoordinator(req.body)){
//     //check to see if email is unique
//     queries
//       .findCoordiantorByEmail(req.body.email)
//       .then(coordinator => {
//         if(coordinator) {
//           //they were foudn and this email is not unique
//           next(new Error('Email in use'));
//         } else {
//           //not found and should insert
//           const coordinator = {
//             first_name: req.body.first_name,
//             last_name: req.body.last_name,
//             email: req.body.email,
//             type: req.body.type,
//             cell: req.body.cell,
//
//           };
//
//           bcrypt
//           .hash(req.body.password, 10)
//           .then((hash) => {
//             coordinator.password = hash;
//             queries
//               .createCoordinator(coordinator)
//               .then(coordinator => {
//                 res.json(coordinator);
//               });
//           });
//
//         }
//       });
//   } else {
//     next(new Error('Invalid User'));
//   }
// });

router.post('/login', (req, res, next) => {
  console.log('hitting the route')
  if(validCoordinator(req.body)){
    //check to see if email is unique
    queries
      .findCoordiantorByEmail(req.body.email)
      .then(coordinator => {
        console.log(coordinator)
        if(coordinator) {
          //compare passwords
          queries
            .findPasswordById(coordinator.id)
            .then(response => {
              console.log(response.password)
              bcrypt
              .compare(req.body.password, response.password)
              .then((result) => {
                console.log(result)
            if(result){
              queries
                .findStakeholderTypeById(coordinator.id)
                .then(stakeholerType => {
                  let token = jwt.sign({id:coordinator.id, type:stakeholerType.type}, 'testKey')
                  res.json({token:token});
                })
            }else {
              res.sendStatus(403)
              next(new Error('Incorrect password'));
            }
          })
        })
          //they were foumnd and login
        } else {
          //not found should signup
          res.sendStatus(400)
          next(new Error('Email not found. Please create an account'));
        }
      });
  } else {
    res.sendStatus(403)
    next(new Error('Invalid User Credentials'));
  }
});


module.exports = router;
