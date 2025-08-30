module.exports = {
  presets: [
    '@babel/preset-env', // Transforms modern JavaScript
    '@babel/preset-typescript', // Transforms TypeScript
    ['@babel/preset-react', { runtime: 'classic' }], // Transforms JSX
  ],
  plugins: ['babel-plugin-transform-import-meta', 'istanbul'],
};
