const ROUTES = new Map([
  ['/', { statusCode: 200, content: 'home' }],
  ['/ping', { statusCode: 200, content: 'pong' }],
  ['/echo', { statusCode: 200, content: 'echo' }],
]);

module.exports = {
  ROUTES,
};
