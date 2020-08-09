'use strict';

module.exports = (service) => {
    const uuid = require('uuid');

    return function(req, res, next){
        let userId = req.cookies.userId;
        if(!userId){
            userId = uuid.v4();
            res.cookie('userId', userId);
        }else {
            service.getUsername(userId).then(username => {
                console.log(username);
                req.user = {
                    id: userId,
                    name: username
                };
                next();
            });
        }        
    };
};
