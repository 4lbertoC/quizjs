#!/usr/bin/env node
'use strict';
var meow = require('meow');
var quizjsServer = require('./');

var cli = meow({
  help: [
    'Usage',
    '  quizjs-server <input>',
    '',
    'Example',
    '  quizjs-server Unicorn'
  ].join('\n')
});

quizjsServer(cli.input[0]);
