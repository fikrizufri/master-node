const htpp = require('http');
const port = process.env.PORT || 3000;
const app = require('./app');

const server = htpp.createServer(app);

server.listen(port);