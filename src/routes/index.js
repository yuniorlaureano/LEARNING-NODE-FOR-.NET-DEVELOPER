'use strict';

module.exports = (games) => {

  var express = require('express');
  var router = express.Router();

  router.get('/', function(req, res, next) {
    Promise.all([
      games.createdBy(req.user.id),
      games.availableTo(req.user.id)
    ]).then(results => {
      console.log(results);
      res.render('index', {
        title: 'Hangman',
        userId: req.user.id,
        createdGames: results[0],
        availableGames: results[1],
        partials: {
          'createdGame': 'createdGame'
        }
      });
    }).catch(next);    
  });

  return router;
};
