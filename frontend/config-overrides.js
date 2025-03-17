const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    include: /node_modules/,
    exclude: [/node_modules\/react-datepicker/], // Loại trừ react-datepicker khỏi source-map-loader
  })
);