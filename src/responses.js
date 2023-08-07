const RESPONSES = new Map([
  ['/', { ...HTTP_STATUS.OK, details: 'home' }],
  ['/ping', { ...HTTP_STATUS.OK, details: 'pong' }],
  ['/echo', { ...HTTP_STATUS.OK, details: 'echo' }],
]);
