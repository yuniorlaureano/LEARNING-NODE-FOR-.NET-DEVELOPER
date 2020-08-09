'use strict';

const expect = require('chai').expect;

describe('Game service', () => {
    const firstUserId = 'user-id-1';
    const secondUserId = 'user-id-2';

    let service;
    before((done) => {
        require('../../src/config/mongoose').then((mogoose) => {
            service = require('../../src/services/games')(mogoose);
            done();
        }).catch(done);
    });

    beforeEach((done) => {
        service.availableTo("no-a-user")
               .then(games => games.map(game => game.remove()))
               .then(gamesRemoved => Promise.all(gamesRemoved))
               .catch(() => done(), done);
    });

    describe('list of available games', () => {
        it('should include games set by other users', () => {
            //Given
            service.create(firstUserId, 'testing');

            //When
            const games = service.availableTo(secondUserId);

            //Then
            expect(games.length).to.equal(1);
            const game = games[0];
            expect(game.setBy).to.equal(firstUserId);
            expect(game.word).to.equal('TESTING');
        });

        it('should not include games set by the same user', () => {
            //Give
            service.create(firstUserId, 'first');
            service.create(secondUserId, 'second');

            //When
            const games = service.availableTo(secondUserId);

            //Then
            expect(games.length).to.equal(1);
            const game = games[0];
            expect(game.setBy).not.to.equal(secondUserId);
        });
    });
});