const header_parse = require('./header_parse.js')
const header_serialize = require('./header_serialize.js')

class Extension {

  constructor(options = {}, maxPayload) {
    this.options = options;
    this.maxPayload = maxPayload;
  }

  /**
   * Get extension name
   */
  static get name() {}

  /**
   * Accept an extension negotiation offer.
   * @param {Array} offers Extension negotiation offers. Contains parsed args for each offer.
   * @return {Object} Accepted params
   */
  static accept(offers) {}

  processData(receiver, data, callback) {}
}

module.exports = Extension
module.exports.header_parse = header_parse
module.exports.header_serialize = header_serialize
module.exports.handleNegotiation = handleNegotiation

function handleNegotiation(server, socket, req) {
  const { extensions, options: { maxPayload } } = server;

  if (!extensions.length) {
    return;
  }

  socket.extensions = new Map();
  const { extensions: negotiated } = socket;

  try {
    const offers = header_parse(req.getHeader('Sec-WebSocket-Extensions'));

    for (const Extension of extensions) {
      const extName = Extension.name;
      const extOffers = getOfferParams(offers, extName);

      const accepted = Extension.accept(extOffers);

      if (!accepted) {
        continue;
      }

      const instance = new Extension(accepted, maxPayload);

      negotiated.set(extName, instance);
    }
  } catch (err) {
    return err;
  }
}

function getOfferParams(offers, extensionName) {
  return offers
    .filter(({ name }) => name === extensionName)
    .map(offer => offer.params);
}

