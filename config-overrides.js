// config-overrides.js
const JavaScriptObfuscator = require('javascript-obfuscator');

module.exports = function override(config, env) {
  if (env === 'production') {
    // Obfuscate the code in production build
    config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;

    config.plugins.push(
      new JavaScriptObfuscator({
        rotateStringArray: true,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
      }, [])
    );
  }

  return config;
};
