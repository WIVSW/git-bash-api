const fromRoot = require('./helpers/from-root');

module.exports = {
	entry: fromRoot('src/index.js'),
	optimization: {
		minimize: process.env.NODE_ENV !== 'development',
		splitChunks: {
			cacheGroups: {
				default: false,
				vendors: false,
				vendor: {
					name: 'vendor',
					chunks: 'all',
					test: /[\\/]node_modules[\\/]/,
					priority: 20,
				},
				common: {
					name: 'common',
					minChunks: 2,
					chunks: 'all',
					priority: 10,
					reuseExistingChunk: true,
					enforce: true,
				},
			},
		},
	},
};
