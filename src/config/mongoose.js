'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('hangman:config:mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const {MONGODB_URL} = require('./dotenv');
const mongoServer = new MongoMemoryServer();

mongoose.Promise = Promise;

// if(!process.env.MONGODB_URL){
//     debug('MongoDB URL not found. Falling back to in-memory database...');
//     mongoServer.getUri().then((mongoUri) => {
//         mongoose.connect(mongoUri, mongooseOptions);
//     });
// } else {
//     mongoose.connect(process.env.MONGODB_URL, mongooseOptions);
// }

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(MONGODB_URL.trim());
const connection = mongoose.connection; 
module.exports = new Promise(function(resolve, reject){
    connection.once('open', () => resolve(mongoose));
    connection.on('error', reject);
});