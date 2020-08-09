'use strict';

module.exports = require('./config/mongoose').then((mongoose) => {
    const {REDIS_URL, NODE_ENV} = require('./config/dotenv');
    const app = require('../src/app')(mongoose);
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    if(REDIS_URL && NODE_ENV !== 'test'){
        const redisAdapter = require('socket.io-redis');
        io.adapter(redisAdapter(REDIS_URL));
    }

    const userService = require('./services/users');
    const passport = require('./config/passport')(userService);
    const session = require('./middleware/sessions');

    io.use(addapt(require('cookie-parser')()));
    const gamesService = require('./services/games');
    // io.use(addapt(require('./middleware/user')(usersService)));
    // io.use(session);
    io.use(function(socket, next){
        session(socket.request, {}, next);
    });
    io.use(addapt(passport.initialize()));
    io.use(addapt(passport.session()));
    require('./realtime/chat')(io);
    require('./realtime/game')(io, gamesService);
    
    server.on('close', () => {
        require('../src/config/redis').quit();
        mongoose.disconnect();
    });
    return server;
});

function addapt(expressMiddleware){
    return (socket, next) => {
        expressMiddleware(socket.request, socket.request.res, next);
    };
}