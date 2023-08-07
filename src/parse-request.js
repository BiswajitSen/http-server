const parseHeaders = (rawHeaders) => {
  const headers = rawHeaders.map((header) => header.split(': '));
  return Object.fromEntries(headers);
};

const parseRequest = (httpRequest) => {
  const [requestLine, ...rawHeaders] = httpRequest.trim().split('\r\n');
  const [method, uri, protocol] = requestLine.split(' ');
  const headers = parseHeaders(rawHeaders);

  return { method, uri, protocol, headers };
};

module.exports = {
  parseRequest,
};
