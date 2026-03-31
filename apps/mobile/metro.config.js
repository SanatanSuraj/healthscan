const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Keep Expo defaults (doctor check) and add monorepo root so workspace packages resolve.
const baseWatch = config.watchFolders?.length ? config.watchFolders : [projectRoot];
config.watchFolders = Array.from(new Set([...baseWatch, workspaceRoot]));
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

const resolveRequestContext = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'react-native-web/dist/index' ||
    moduleName === 'react-native-web/dist/index.js'
  ) {
    return {
      type: 'sourceFile',
      filePath: require.resolve('react-native-web/dist/index.js', {
        paths: [projectRoot],
      }),
    };
  }
  if (resolveRequestContext) {
    return resolveRequestContext(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
