const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for TensorFlow.js and MediaPipe
config.resolver.assetExts.push(
  'bin',
  'json'
);

// Ensure proper module resolution for TensorFlow
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'cjs'
];

module.exports = config;
