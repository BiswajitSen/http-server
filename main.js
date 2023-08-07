const { Server } = require('node:net');
const { parseRequest } = require('./src/parse-request');
const { Request } = require('./src/request');
const { Response } = require('./src/response');
const { RequestHandler } = require('./src/request-handler');

const initiateServer = (server) => {
  server.on('connection', (socket) => {
    socket.setEncoding('utf-8');

    socket.on('data', (rawRequest) => {
      const requestInfo = parseRequest(rawRequest);
      const request = new Request(requestInfo);
      const response = new Response('HTTP/1.1', socket);
      const requestHandler = new RequestHandler(request, response);
      requestHandler.createUriResponse();
    });
  });
};

const main = () => {
  const server = new Server();
  const port = process.argv[2];
  initiateServer(server);
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main();
