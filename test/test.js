/*global describe, it */
'use strict';
var assert = require('assert');
var QuizJsServer = require('../');

describe('quizjs-server node module', function() {

    describe('.registerClient()', function() {

        it('registers a new client and returns its id', function() {
            var qjs = new QuizJsServer();
            var clientId = qjs.registerClient();

            assert(typeof clientId !== 'undefined');
        });

        it('emits an event to its listeners', function() {
            var qjs = new QuizJsServer();
            var clientId;
            var eventClientId;
            var isCallbackCalled = false;

            qjs.on(QuizJsServer.EVENT.CLIENT.REGISTER, function(data) {
                eventClientId = data.clientId;
                isCallbackCalled = true;
            });

            clientId = qjs.registerClient();
            assert(isCallbackCalled, 'The client registration callback has not been called');
            assert(eventClientId === clientId, 'The registered client\'s id is not included in the event data');
        });

    });

    describe('.subscribe(clientId)', function() {

        it('adds a client to the subscribers queue', function() {
            var qjs = new QuizJsServer();
            var client = qjs.registerClient();
            var speakerId;

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function(data) {
                speakerId = data.speakerId;
            });

            qjs.subscribe(client);
            assert(speakerId === client, 'The subscribed client is not registered');
        });

        it('emits a state update event', function() {
            var qjs = new QuizJsServer();
            var client = qjs.registerClient();
            var isCallbackCalled = false;

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function(data) {
                isCallbackCalled = true;
            });

            qjs.subscribe(client);
            assert(isCallbackCalled, 'The state update callback has not been called');
        });

    });

    describe('.nextSubscriber()', function() {

        it('gives the next client in the queue the possibility to answer', function() {
            var qjs = new QuizJsServer();
            var client1 = qjs.registerClient(); // client 1
            var client2 = qjs.registerClient() // client 2
            var speakerId;

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function(data) {
                speakerId = data.speakerId;
            });

            qjs.subscribe(client1); // queue = [1]
            qjs.subscribe(client2); // queue = [1, 2]
            qjs.nextSubscriber(); // queue = [2]

            assert(speakerId === client2, 'The last subscriber should be the one who can speak');
        });

        it('returns undefined if there are no subscribers', function() {
            var qjs = new QuizJsServer();
            var speakerId;

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function(data) {
                speakerId = data.speakerId;
            });

            qjs.nextSubscriber(); // queue = []

            assert(typeof speakerId === 'undefined', 'Is not returning undefined if the queue is empty');
        });

        it('emits a state update event', function() {
            var qjs = new QuizJsServer();
            var isCallbackCalled = false;

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function(data) {
                isCallbackCalled = true;
            });

            qjs.nextSubscriber();

            assert(isCallbackCalled, 'The state update callback has not been called');
        });

    });

    describe('.resetState()', function() {

        it('resets the state of the quiz', function() {
            var qjs = new QuizJsServer();
            var speakerId;

            // Register some clients
            qjs.registerClient();
            qjs.registerClient();
            qjs.registerClient();
            qjs.resetState();

            qjs.on(QuizJsServer.EVENT.STATE.UPDATE, function(data) {
                speakerId = data.speakerId;
            });

            assert(typeof speakerId === 'undefined', 'The speaker id should be undefined after a reset');
        });

        it('emits a state reset event', function() {
            var qjs = new QuizJsServer();
            var isCallbackCalled = false;

            qjs.on(QuizJsServer.EVENT.STATE.RESET, function(data) {
                isCallbackCalled = true;
            });

            qjs.resetState();

            assert(isCallbackCalled, 'The state reset callback has not been called');
        });

    });
});