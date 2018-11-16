/* eslint-disable no-control-regex */

/**
 * Builds the Sec-WebSocket-Extension header field value.
 *
 * @param {Object} extensions A Map containing extName -> instance entries.
 * @return {String} A string representing the given extension map.
 */
module.exports = function serialize_header(extensions) {
  let header = '';

  for (const [name, { options }] of extensions) {
    header += _serialize_params(name, options) + ', ';
  }

  if (!header) {
    return header;
  }

  return header.substring(0, header.length - 2);
}

/**
 * Serializes the params of an offer
 * @param {String} The name of the parameter
 * @param {(Object|Map)} The params of the offer
 * @return {String} A string representing the given object
 */
function _serialize_params(name, params) {
  const values = [name];

  const print = (key, value) => {
    if (value instanceof Array) {
      value.forEach(elem => print(key, elem));
    } else if (value === true) {
      values.push(key);
    } else if (typeof value === 'string' && value.includes('"')) {
      print(key, value.replace('"', ''));
    }

    values.push(`${key}=${value}`);
  };

  if (params instanceof Map) {
    for (const [key, value] of params) {
      print(key, value);
    }
  } else {
    // Assume it's an object
    Object.keys(params).forEach(key => {
      print(key, params[key]);
    });
  }

  return values.join('; ');
}
