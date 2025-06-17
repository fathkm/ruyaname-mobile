/**
 * Metro configuration for React Native
 * https://github.com/facebook/metro
 *
 * No custom transformers.
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
