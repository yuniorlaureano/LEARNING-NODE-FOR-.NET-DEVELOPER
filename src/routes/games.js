'use strict';

module.exports = (service) => {

    const express = require('express');
    const router = express.Router();

    const checkGameExists = function(id, res, onSuccess, onError){
        service.get(id)
            .then(game => {
                if (game) {                    
                    onSuccess(game);
                } else {
                    res.status(404).send('Non-existent game ID');
                }
            }).catch(onError);    
    }

    router.get('/:id', function(req, res, next){
        checkGameExists(req.params.id, res, game => {
            res.render('game', {
                length:  game.word.length,
                id: game._id
            });
        }, next);
    });

    router.post('/:id/gesses', function(req, res, next){
        checkGameExists(req.params.id, res, game => {
            if(req.user && game.matches(req.body.word)){
                userService.recordWin(req.user.id);
            }
            res.send({
                positions: game.positionsOf(req.body.letter)
            }, next);
        })
    });

    router.post('/', function(req, res, next){
        const word = req.body.word;
        if(word && /^[A-Za-z]{3,}$/.test(word)){
            service.create(req.user.id, word).then((game) => {
                res.redirect(`/games/${game._id}/created`);
            });
            
        }else{
            res.status(404).send('Word must be at least three characters long and contain only letters');
        }
    });

    router.delete('/:id', function(req, res, next){
        checkGameExists(req.params.id, res, game => {
            if(game){
                game.remove()
                    .then(()=> res.send())
                    .catch(next);
            }else{
                res.status(403).send("You don't have permission to delete this game")
            }
        }, next);
    });

    router.get('/:id/created', function(req, res, next){
        checkGameExists(req.params.id, res, game => {
            res.render('createdGame', game);
        }, next);
    });

    return router;
};