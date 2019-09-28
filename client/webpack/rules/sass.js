const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const plugins = [
	autoprefixer({
		browsers: ['ie >= 8', 'last 4 version'],
	}),
];

if (process.env.NODE_ENV !== 'development') {
	plugins.push(cssnano({
		discardComments: {
			removeAll: true,
		},
	}));
}

module.exports = {
	test: /\.scss$/,
	use: [
		MiniCssExtractPlugin.loader,
		'css-loader',
		{
			loader: 'postcss-loader',
			options: {
				plugins: () => [autoprefixer({
					browsers: ['ie >= 8', 'last 4 version'],
				})],
			},
		},
		'sass-loader',
	],
};
