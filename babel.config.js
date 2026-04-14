module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          components: './app/components',
          navigation: './app/navigation',
          style: './app/style',
          utils: './app/utils',
          types: './app/types',
          hooks: './app/hooks',
          context: './app/context',
          services: './app/services',
          helpers: './app/helpers',
        },
      },
    ],
  ],
};
