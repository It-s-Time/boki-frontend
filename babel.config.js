module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        // This project's bundled Hermes build doesn't support private class
        // fields/methods yet, but babel-preset-expo's default Hermes profile
        // ('hermes-stable') assumes it does and skips downleveling them —
        // which crashes on any private-field code that reaches the bundle
        // (e.g. React Native core's own DOMRectReadOnly polyfill, unrelated
        // to anything in this app). Forcing the older profile restores the
        // downlevel transform.
        { unstable_transformProfile: 'hermes-v0' },
      ],
    ],
    plugins: ['react-native-worklets/plugin'],
  };
};
