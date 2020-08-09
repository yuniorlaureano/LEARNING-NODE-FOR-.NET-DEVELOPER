const dotenv = require('dotenv');
dotenv.config();
module.exports = { 
    MONGODB_URL: process.env.MONGODB_URL,
    REDIS_URL: process.env.REDIS_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID, 
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET
};