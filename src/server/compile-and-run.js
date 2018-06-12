const micro = require('micro');
const webpack = require('webpack');
const path = require('path');
const requireFromString = require('require-from-string');
const MemoryFS = require('memory-fs');
const promiseFinally = require('promise.prototype.finally');
const serverConfig = require('../../webpack.config.server.dev.js');
const fs = new MemoryFS();

promiseFinally.shim();

const outputErrors = (err, stats) => {
    if (err) {
         console.error(err.stack || err);
         if (err.details) {
              console.error(err.details);
         }
         return;
    }

    const info = stats.toJson();
    if (stats.hasErrors()) {
        console.error(info.errors);
    }
    if (stats.hasWarnings()) {
        console.warn(info.warnings);
    }
};
console.log('Compiling bundle...');
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = fs;
serverCompiler.run((err, stats) => {
    outputErrors(err, stats);
    const contents = fs.readFileSync(path.resolve(serverConfig.output.path, serverConfig.output.filename), 'utf8');
    const func = requireFromString(contents, serverConfig.output.filename).default;
    const server = micro(func);
    server.listen(3000);
    console.log('Server listening on port 3000!');
});
