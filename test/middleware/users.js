'use strict';

const middleware = require('../../src/middleware/user');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Users middleware', () => {
    const defaultUserId = 'user-id-1';
    let request, response;

    beforeEach(() => {
        request = {cookies: {}};
        response = {cookie: () => {}};
    });

    it('calls the next middleware in the chain', () => {
        //Given
        const next = sinon.spy();

        //When
        middleware(request, {}, next);

        //Then
        expect(next.called).to.be.true;
    });

    it('if the user already signed in, reads their ID from a cookie and exposes the user on the request', () => {
        //Given
        request.cookies.userId = defaultUserId;

        //When
        middleware(request, response, () => {});

        //Then
        expect(request.user).to.exist;
        expect(request.user.id).to.equal(defaultUserId);
    });

    it('if the user is not already signed in, ' +
    'creates a new user id and stores it in a cookie', () => {
        //Given
        request.cookies.userId = undefined;
        response = {cookie: sinon.spy()};

        //When
        middleware(request, response, () => {});

        //Then
        expect(response.user).to.exist;
        const newUserId = request.user.id;
        expect(newUserId).exist.to.exist;
        expect(response.cookie.calledWith('userId',newUserId)).to.be.true;
    });
});