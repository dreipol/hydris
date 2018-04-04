const hydris = require('../');
const os = require('os');
const cluster = require('cluster');

if (cluster.isMaster) {
    console.log(`Master ${ process.pid } is running`);

    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`worker ${ worker.process.pid } died`);
    });
} else {
    hydris.server.start({
        port: 3000,
    });

    console.log(`Worker ${ process.pid } started`);
}
