'use strict';

module.exports = require('./config/mongoose').then((mongoose) => {
    const app = require('../src/app')(mongoose);
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    if(process.env.REDIS_URL && process.env.NODE_ENV !== 'test'){
        const redisAdapter = require('socket.io-redis');
        io.adapter(redisAdapter(process.env.REDIS_URL));
    }

    io.use(addapt(require('cookie-parser')()));
    const usersService = require('./services/users');
    const gamesService = require('./services/games');
    io.use(addapt(require('./middleware/user')(usersService)));
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
        expressMiddleware(socket.request, socket.response, next);
    }
}