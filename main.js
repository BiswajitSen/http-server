const net = require('node:net');
const { initiateServer } = require('./src/http-server');

const main = () => {
  const server = new net.Server();
  const port = process.argv[2];
  initiateServer(server);
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main();
