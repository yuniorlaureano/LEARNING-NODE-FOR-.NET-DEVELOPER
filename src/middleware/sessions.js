'use strict';

const session = require('express-session');
const {SESSION_SECRET, REDIS_URL, NODE_ENV} = require('../config/dotenv');
let redisClient = require('../config/redis');

let config = {
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false
};

if(REDIS_URL && NODE_ENV !=='test'){
    const RedisStore = require('connect-redis')(session);
    config.store = new RedisStore({ client: redisClient });
}

const expressSession = session(config);
// module.exports = (passport) => [expressSession, passport.initialize(), passport.session()];
module.exports = session(config);