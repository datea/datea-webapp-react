const micro = require('micro');
const path = require('path');
const serverFunc = require('../../dist/server');

const server = micro(serverFunc);
server.listen(3000);
console.log('Server listening on port 3000!');
