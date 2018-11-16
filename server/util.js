const crypto = require('crypto');
const statusCodes = require('turbo-http/http-status');
const { parse } = require('url');
const { magicValue } = require('./constants.js');

export {
  statusCodes,
  asksForUpgrade,
  shouldHandleRequest,
  pathEquals,
  getUpgradeKey,
  addListeners,
  forwardEvent
};

// Upgrade utils
function asksForUpgrade(req) {
  return (
    req.method === 'GET' &&
    req.getHeader('Upgrade').toLowerCase() === 'websocket'
  );
}

function shouldHandleRequest(server, req, version) {
  return (
    isValidVersion(version) && server.shouldHandle(req) // TODO Create version func
  );
}

function isValidVersion(version) {
  return version === 8 || version === 13;
}

function pathEquals(path, req) {
  return parse(req.url).pathname === path;
}

function getUpgradeKey(clientKey) {
  return crypto
    .createHash('sha1')
    .update(`${clientKey}${magicValue}`, 'binary')
    .digest('base64');
}

// EventEmitter utils

function addListeners(server, events) {
  const eventNames = Object.keys(events);

  for (const event of eventNames) {
    server.on(event, events[event]);
  }

  // Return anonymous function to remove all the added listeners when called
  return function() {
    for (const event of eventNames) {
      server.removeListener(event, events[event]);
    }
  };
}

function forwardEvent(server, eventName) {
  return server.emit.bind(server, eventName);
}
