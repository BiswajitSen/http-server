const { ROUTES } = require('./routes');

class Request {
  #uri;
  #method;
  #headers;
  #protocol;

  constructor({ method, protocol, uri, headers }) {
    this.#uri = uri;
    this.#method = method;
    this.#headers = headers;
    this.#protocol = protocol;
  }

  get uri() {
    return this.#uri;
  }

  isValidUri() {
    return ROUTES.has(this.#uri);
  }

  extractPathComponents() {
    return this.#uri.split('/').slice(2);
  }

  hasPathComponent() {
    return this.extractPathComponents().length > 0;
  }

  isValidMethod() {
    return this.#method === 'GET';
  }

  isValidProtocol() {
    return this.#protocol === 'HTTP/1.1';
  }

  hasHTTPUserAgent() {
    return 'User-Agent' in this.#headers;
  }
}

module.exports = {
  Request,
};
