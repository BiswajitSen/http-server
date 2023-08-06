const HTTP_STATUS = {
  OK: { statusCode: 200, status: 'OK' },
  METHOD_NOT_ALLOWED: { statusCode: 405, status: 'METHOD_NOT_ALLOWED' },
  BAD_REQUEST: { statusCode: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { statusCode: 404, status: 'NOT_FOUND' },
};

const RESPONSES = new Map([
  ['/', { ...HTTP_STATUS.OK, details: 'home' }],
  ['/ping', { ...HTTP_STATUS.OK, details: 'pong' }],
  ['/echo', { ...HTTP_STATUS.OK, details: 'echo' }],
]);

const isInvalidProtocol = (protocol) => protocol.trim().toUpperCase() !== 'HTTP/1.1';
const isInvalidMethod = (method) => method.trim() !== 'GET';
const isInvalidUri = (uri) => !RESPONSES.has(uri);

const createResponse = (statusCode, status, details) => ({ statusCode, status, details });

const createInvalidMethodResponse = () =>
  createResponse(
    HTTP_STATUS.METHOD_NOT_ALLOWED.statusCode,
    HTTP_STATUS.METHOD_NOT_ALLOWED.status,
    'Method not allowed'
  );

const createInvalidProtocolResponse = () =>
  createResponse(
    HTTP_STATUS.BAD_REQUEST.statusCode,
    HTTP_STATUS.BAD_REQUEST.status,
    'bad request'
  );

const createInvalidUriResponse = (uri) =>
  createResponse(
    HTTP_STATUS.NOT_FOUND.statusCode,
    HTTP_STATUS.NOT_FOUND.status,
    `${uri} not found`
  );

const getUriPathComponents = (uri) => uri.split('/').slice(2);
const hasPathComponent = (uri) => getUriPathComponents(uri).length > 0;

const createHasChildResponse = (uri) =>
  createResponse(
    HTTP_STATUS.OK.statusCode,
    HTTP_STATUS.OK.status,
    getUriPathComponents(uri).join('')
  );

const createResponseForUri = (action, uri, protocol) => {
  if (isInvalidProtocol(protocol)) return createInvalidProtocolResponse();
  if (isInvalidMethod(action)) return createInvalidMethodResponse();
  if (hasPathComponent(uri)) return createHasChildResponse(uri);
  return isInvalidUri(uri) ? createInvalidUriResponse(uri) : RESPONSES.get(uri);
};

const handleRequest = (socket, action, uri, protocol) => {
  const { statusCode, status, details } = createResponseForUri(action, uri, protocol);

  const response = `HTTP/1.1 ${statusCode} ${status}\n\n${details}\n`;
  socket.write(response);
  socket.end();
};

const parseRequest = (data) => {
  return data.split('\r')[0].split(' ');
};

const initiateServer = (server) => {
  server.on('connection', (socket) => {
    socket.setEncoding('utf-8');

    socket.on('data', (data) => {
      const request = parseRequest(data);
      handleRequest(socket, ...request);
    });
  });
};

module.exports = {
  initiateServer,
};
