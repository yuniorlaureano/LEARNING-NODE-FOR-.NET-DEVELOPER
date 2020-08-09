
// const asAsync = (callback, result) => {
//     process.nextTick(() => callback(null, result));
// };

const EventEmitter = require('events');
const emitter = new EventEmitter();

module.exports = (mongoose) => {
    'use strict';

    mongoose.Promise = Promise;
    mongoose.connect('mongodb://localhost/hagman');

    let Game = mongoose.models['Game'];
    if(!Game){
        const Schema = mongoose.Schema;
        const gameSchema = new Schema({
            word: String,
            setBy: String
        });

        gameSchema.methods.positionsOf = function(character){
            let positions = [];
            character = character.toUpperCase();
            for(let i in this.word){
                if(this.word[i] === character){
                    positions.push(i);
                }
            }
            return positions;
        };

        gameSchema.post('save', game => emitter.emit('gameSaved', game));
        gameSchema.post('remove', game => emitter.emit('gameRemoved', game))
        Game = mongoose.model('Game', gameSchema);
    }   

    return {
        create: (userId, word) => {
            const game = new Game({
                setBy: userId,
                word: word
            });
            return game.save();
        },
        get: (id) => Game.findById(id),         
        createdBy: (userId) => Game.find({setBy: userId}),
        availableTo:(userId) => Game.find({setBy: {$ne: userId}}),
        events: emitter
    };
};

module.exports.events = emitter;
