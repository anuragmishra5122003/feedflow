const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const blockList = [
  /feedflow-backend\/.*/,
  /feedflow-backend\\.*/,
];

config.resolver.blockList = blockList;

module.exports = config;