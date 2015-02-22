/*global describe, it */
'use strict';
var assert = require('assert');
var quizjsServer = require('../');

describe('quizjs-server node module', function () {
  it('must have at least one test', function () {
    quizjsServer();
    assert(false, 'I was too lazy to write any tests. Shame on me.');
  });
});
