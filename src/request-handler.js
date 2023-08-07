const { ROUTES } = require('./routes');

class RequestHandler {
  #request;
  #response;

  constructor(request, response) {
    this.#request = request;
    this.#response = response;
  }

  #sendResponse(statusCode, content) {
    this.#response.setStatus(statusCode);
    this.#response.setContent(content);
    this.#response.end();
  }

  sendBadRequestResponse() {
    this.#sendResponse(400, 'Bad #request');
  }

  sendInvalidMethodResponse() {
    this.#sendResponse(405, 'Method not allowed');
  }

  sendInvalidUriResponse() {
    this.#sendResponse(404, `${this.#request.uri} not found`);
  }

  sendHasPathComponentsResponse() {
    this.#sendResponse(200, this.#request.extractPathComponents().join('/'));
  }

  sendUriResponse() {
    const route = ROUTES.get(this.#request.uri);
    if (!route) {
      this.sendInvalidUriResponse();
      return;
    }

    const { statusCode, content } = route;
    this.#sendResponse(statusCode, content);
  }

  createUriResponse() {
    if (!this.#request.hasHeader('User-Agent') || !this.#request.isValidProtocol()) {
      this.sendBadRequestResponse();
      return;
    }

    if (!this.#request.isValidMethod()) {
      this.sendInvalidMethodResponse();
      return;
    }

    if (this.#request.hasPathComponent()) {
      this.sendHasPathComponentsResponse();
      return;
    }

    this.sendUriResponse();
  }
}

module.exports = {
  RequestHandler,
};
