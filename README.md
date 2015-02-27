#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

# QuizJs

A web-based platform for live quizzes.

It consists of a __master__ client, one or more __player__ clients and a __server__ to handle the communication between them.

Each player is like a _buzzer button_ that when pressed subscribes the player to a question asked by the master.

The first player to subscribe can answer immediately, while the other players are added to a queue.

If the answer of the first player is wrong, the turn moves to the next client in the queue. This mechanism goes on until either the answer is right or the queue is emptied.


## Install

```sh
$ npm install --save quizjs
```

## Usage

The package contains a basic socket.io server that can be run with:

```sh
node implementations/socket.io/quizjs-socket.io.js
```

The socket.io player and master clients are built into the `dist` directory by running the following code in the command line:

```sh
$ grunt
```

There are no UI components included included in this package.

[Here][simple-player] you can find a simple player implementation.

## Server API

### `QuizJsServer#registerPlayer()`
Registers a new player to the QuizJs server and returns its ID.

### `QuizJsServer#subscribe(playerId)`
Subscribes a player to the current question.

### `QuizJsServer#nextSubscriber()`
Passes the turn to the next subscriber.

### `QuizJsServer#resetState()`
Empties the current subscriber queue and allows all the players to subscribe for a new question.

The QuizJs server also implements the following methods of [events.EventEmitter][node-event-emitter]: `on`, `once`, `removeListener`, `removeAllListeners`.

## Server Events

### `quizjs-register-player`
Sent when a player is registered to the QuizJs server.

### `quizjs-state-reset`
Sent when the QuizJs server state is reset.

### `quizjs-state-update`
Sent when the QuizJs server state is updated.

## License

MIT © [Alberto Congiu](http://albertocongiu.com)


[npm-url]: https://npmjs.org/package/quizjs
[npm-image]: https://badge.fury.io/js/quizjs.svg
[travis-url]: https://travis-ci.org/4lbertoC/quizjs?branch=master
[travis-image]: https://travis-ci.org/4lbertoC/quizjs.svg
[daviddm-url]: https://david-dm.org/4lbertoC/quizjs.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/4lbertoC/quizjs-server
[simple-player]: https://github.com/4lbertoC/quizjs-simpleplayer
[node-event-emitter]: http://nodejs.org/api/events.html#events_class_events_eventemitter