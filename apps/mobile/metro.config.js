const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration for monorepo
 * Ensures Metro can resolve dependencies from both local and root node_modules
 * https://facebook.github.io/metro/docs/configuration
 */
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Configure Metro to look in both project and workspace root node_modules
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;

