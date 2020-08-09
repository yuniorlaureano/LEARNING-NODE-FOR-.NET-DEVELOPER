'use strict';

const bluebird = require('bluebird');
const debug = require('debug');
const {REDIS_URL} = require('./dotenv');

if(process.env.REDIS_URL){
    let redis = require('redis');    
    bluebird.promisifyAll(redis.RedisClient.prototype);
    module.exports = redis.createClient(REDIS_URL);
} else {
    debug('Redis URL not found. Falling back to mock DB...');
    let redisClient = require('redis-js');
    bluebird.promisify(redis.RedisClient.prototype);
    module.exports = redisClient;
}