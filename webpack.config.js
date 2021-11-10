const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.plugins["module-resolver"] = { root: ['./'], extensions: ['.ts', '.tsx', '.js', '.jsx'] };
  return config;
};
