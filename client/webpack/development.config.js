const fromRoot = require('./helpers/from-root');

const {entry, optimization} = require('./common.config');
const {babel, sass} = require('./rules');
const {
	html,
	hmr,
	scriptExt,
	asyncChunkNames,
	sass: sassPlugin,
} = require('./plugins');

module.exports = {
	entry,
	output: {
		path: fromRoot('build'),
		filename: 'js/[name].js',
		chunkFilename: 'js/[name].js',
	},
	optimization,
	module: {
		rules: [
			babel,
			sass,
		],
	},
	devServer: {
		host: 'localhost', // Defaults to `localhost`
		port: 9000, // Defaults to 8080
	},
	plugins: [
		sassPlugin,
		html,
		hmr,
		scriptExt,
		asyncChunkNames,
	],
};
