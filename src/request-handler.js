const { ROUTES } = require('./routes');

class RequestHandler {
  #request;
  #response;

  constructor(request, response) {
    this.#request = request;
    this.#response = response;
  }

  #sendBadRequestResponse() {
    this.#response.setStatus(400);
    this.#response.setContent('bad request');
    this.#response.end();
  }

  #sendInvalidMethodResponse() {
    this.#response.setStatus(405);
    this.#response.setContent('Method not allowed');
    this.#response.end();
  }

  #sendInvalidUriResponse() {
    this.#response.setStatus(404);
    this.#response.setContent(`${this.#request.uri} not found`);
    this.#response.end();
  }

  #sendHasPathComponentsResponse() {
    this.#response.setStatus(200);
    this.#response.setContent(this.#request.extractPathComponents().join('/'));
    this.#response.end();
  }

  #sendUriResponse() {
    console.log(this.#request.uri);
    console.log(ROUTES.get(this.#request.uri));
    const { statusCode, content } = ROUTES.get(this.#request.uri);
    this.#response.setStatus(statusCode);
    this.#response.setContent(content);
    this.#response.end();
  }

  createUriResponse = () => {
    if (!this.#request.hasHTTPUserAgent() || !this.#request.isValidProtocol()) {
      this.#sendBadRequestResponse();
      return;
    }

    if (!this.#request.isValidMethod()) {
      this.#sendInvalidMethodResponse();
      return;
    }

    if (this.#request.hasPathComponent()) {
      this.#sendHasPathComponentsResponse();
      return;
    }

    if (!this.#request.isValidUri()) {
      this.#sendInvalidUriResponse();
      return;
    }

    this.#sendUriResponse();
  };
}

module.exports = {
  RequestHandler,
};
