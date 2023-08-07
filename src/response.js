class Response {
  #socket;
  #content;
  #protocol;
  #statusCode;
  #statusMessage;

  constructor(protocol = 'HTTP/1.1', socket) {
    this.#socket = socket;
    this.#protocol = protocol;
  }

  #setStatusMessage(statusCode) {
    const statusMessages = {
      200: 'OK',
      400: 'BAD_REQUEST',
      404: 'NOT_FOUND',
      405: 'METHOD_NOT_ALLOWED',
    };

    this.#statusMessage = statusMessages[statusCode];
  }

  setStatus(code) {
    this.#statusCode = code;
    this.#setStatusMessage(code);
  }

  setContent(content) {
    this.#content = content;
  }

  #formatResponseLine() {
    return `${this.#protocol} ${this.#statusCode} ${this.#statusMessage}`;
  }

  #timeStamp() {
    return new Date().toGMTString();
  }

  #formatHeaders() {
    const contentLength = this.#content.length;
    return [`date: ${this.#timeStamp()}`, `contentLength: ${contentLength}`].join('\n');
  }

  #formatResponse() {
    const headers = this.#formatHeaders();
    const responseLine = this.#formatResponseLine();
    return `$${responseLine}\r\n${headers}\r\n\r\n${this.#content}`;
  }

  end() {
    const response = this.#formatResponse();
    this.#socket.write(response);
    this.#socket.end();
  }
}

module.exports = {
  Response,
};
