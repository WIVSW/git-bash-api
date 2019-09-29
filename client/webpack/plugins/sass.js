const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = new MiniCssExtractPlugin({
	// Options similar to the same options in webpackOptions.output
	// both options are optional
	chunkFilename: `css/[name]${!isDev ? '.[chunkhash]' : ''}.css`,
});
