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
          interfaces: './app/interfaces',
          navigation: './app/navigation',
          style: './app/style',
          utils: './app/utils',
        },
      },
    ],
  ],
};
