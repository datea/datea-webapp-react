const micro = require('micro');
const path = require('path');
const promiseFinally = require('promise.prototype.finally');
const serverFunc = require('./server').default;

promiseFinally.shim();

const server = micro(serverFunc);
server.listen(3000);
console.log('Server listening on port 3000!');
