const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/schedulequeries');

Router.get('/:id', (req, res) => {
  Queries.getGuardianAvailabilityforDoodle(req.params.id)
    .then(result=>{
        res.send(result.rows);
    });
});

module.exports = Router;
