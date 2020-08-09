'use strict';

const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const {TWITTER_API_KEY, TWITTER_API_SECRET, 
       FACEBOOK_APP_ID, FACEBOOK_APP_SECRET,
       NODE_ENV} = require('./dotenv');

module.exports = (userService) => {
    const providerCallback = providerName => 
        function(req, token, tokenSecret, profile, done){
            userService.getOrCreate(providerName, profile.id,
                profile.username || profile.displayName)
                 .then(user => done(null, user), done);
        };

    if(TWITTER_API_KEY && TWITTER_API_SECRET){
        passport.use(new TwitterStrategy({
            consumerKey:  TWITTER_API_KEY,
            consumerSecret: TWITTER_API_SECRET,
            callbackURL: '/auth/twitter/callback',
            passReqToCallback: true
        }, providerCallback('twitter')));
    }
    console.log('-------------------------------');
    console.log(FACEBOOK_APP_ID);
    if(FACEBOOK_APP_ID && FACEBOOK_APP_SECRET){
        console.log('-------------------------------');
        passport.use(new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: '/auth/facebook/callback',
            passReqToCallback: true
        }, providerCallback('facebook')));
    }

    if (NODE_ENV === 'test') {
        const LocalStrategy = require('passport-local');
        const uuid = require('uuid');
        passport.use(new LocalStrategy((username, password, done) => {
            const userId = uuid.v4();
            usersService.setUsername(userId, username)
                .then(() => {
                    done(null, { id: userId, name: username });
                });
            }
        ));
    }

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        userService.getUser(id)
            .then(user => done(null, user))
            .catch(done);
    });

    return passport;
};