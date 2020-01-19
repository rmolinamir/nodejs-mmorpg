// Libraries
const Parser = require('binary-parser').Parser;

const stringOptions = {
  length: 99,
  zeroTerminated: true,
}

const PacketModels = {
  header: new Parser().skip(1).string('command', stringOptions),
  login: new Parser().skip(1)
    .string('command', stringOptions)
    .string('username', stringOptions)
    // TODO: Password should be encrypted here.
    // This is just to show how it's done. Instead of the real password, hashes should be compared.
    .string('password', stringOptions),
  register: new Parser().skip(1)
    .string('command', stringOptions)
    .string('username', stringOptions)
    // TODO: Password should be encrypted here.
    // This is just to show how it's done. Instead of the real password, hashes should be compared.
    .string('password', stringOptions),
  pos: new Parser().skip(1)
    .string('pos', stringOptions)
    .int32le('target_x')
    .int32le('target_y'),
};

module.exports = PacketModels;
