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

const createResponse = (statusCode, status, details) => ({ statusCode, status, details });

const invalidMethod = () =>
  createResponse(
    HTTP_STATUS.METHOD_NOT_ALLOWED.statusCode,
    HTTP_STATUS.METHOD_NOT_ALLOWED.status,
    'Method not allowed'
  );

const badRequest = () =>
  createResponse(
    HTTP_STATUS.BAD_REQUEST.statusCode,
    HTTP_STATUS.BAD_REQUEST.status,
    'bad request'
  );

const invalidUri = (uri) =>
  createResponse(
    HTTP_STATUS.NOT_FOUND.statusCode,
    HTTP_STATUS.NOT_FOUND.status,
    `${uri} not found`
  );

const getUriPathComponents = (uri) => uri.split('/').slice(2);
const hasPathComponent = (uri) => getUriPathComponents(uri).length > 0;

const pathComponentsArePresent = (uri) =>
  createResponse(
    HTTP_STATUS.OK.statusCode,
    HTTP_STATUS.OK.status,
    getUriPathComponents(uri).join('/')
  );

const getTimeStamp = () => {
  const date = new Date();
  return `date: ${date.toGMTString()}`;
};

const parseHeaders = (rawHeaders) => {
  const requestHeaders = {};
  rawHeaders.forEach((rawheader) => {
    const [header, value] = rawheader.trim().split(': ');
    requestHeaders[header] = value;
  });

  return requestHeaders;
};

const parseRequest = (data) => {
  const [requestLine, ...rawHeaders] = data.split('\r\n');
  const [action, uri, protocol] = requestLine.split(' ');
  const headers = parseHeaders(rawHeaders);
  return { action, uri, protocol, headers };
};

const isInvalidUri = (uri) => !RESPONSES.has(uri);
const isInvalidMethod = (method) => method.trim() !== 'GET';
const isInvalidProtocol = (protocol) => protocol.trim().toUpperCase() !== 'HTTP/1.1';
const hasNoMentionOfUserAgent = (headers) => !('User-Agent' in headers);

const createResponseForUri = ({ action, uri, protocol, headers }) => {
  if (hasNoMentionOfUserAgent(headers) || isInvalidProtocol(protocol))
    return badRequest(headers);

  if (isInvalidMethod(action)) return invalidMethod();

  if (hasPathComponent(uri)) return pathComponentsArePresent(uri);

  return isInvalidUri(uri) ? invalidUri(uri) : RESPONSES.get(uri);
};

const formatResponse = ({ statusCode, status, details }) =>
  `HTTP/1.1 ${statusCode} ${status}\r\n${getTimeStamp()}\r\n\r\n${details}`;

const handleRequest = (socket, request) => {
  const response = createResponseForUri(request);
  socket.write(formatResponse(response));
  socket.end();
};

const initiateServer = (server) => {
  server.on('connection', (socket) => {
    socket.setEncoding('utf-8');
    socket.on('data', (rawRequest) => {
      const request = parseRequest(rawRequest);
      handleRequest(socket, request);
    });
  });
};

module.exports = {
  initiateServer,
};
