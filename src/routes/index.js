'use strict';

module.exports = (games) => {

  var express = require('express');
  var router = express.Router();

  router.get('/', function(req, res, next) {
    let userId = null;
    if(req.user){
      userId = req.user.id;
    }
    
    Promise.all([
      games.createdBy(userId),
      games.availableTo(userId)
    ]).then(results => {
      res.render('index', {
        title: 'Hangman',
        loggedIn: req.isAuthenticated(),
        userId: userId,
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
