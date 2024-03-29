module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // path alias "@"
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
          },
        },
      ],
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
    // react-native-paper tree shaking
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  }
}
