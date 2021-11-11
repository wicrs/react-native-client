const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.plugins["module-resolver"] = { root: ['./'], extensions: ['.ts', '.tsx', '.js', '.jsx'] };
  config.devServer.headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, Content-type, Authorization"
  };
  config.devServer.allowedHosts = ["auto"];
  return config;
};
