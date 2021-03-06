module.exports.unmask = function (buffer, mask) {
  const { length } = buffer;
  for (let i = 0; i < length; i++) {
    buffer[i] ^= mask[i & 3];
  }
}
