// see https://gist.github.com/pguillory/729616
module.exports = function hook(callback) {
    const oldWrite = process.stdout.write;

    process.stdout.write = function(string, encoding, fd) {
        callback(string, encoding, fd);
    };

    return function() {
        process.stdout.write = oldWrite;
    };
};
