const clean = require('./clean');
const hmr = require('./hmr');
const html = require('./html');
const scriptExt = require('./script-ext');
const asyncChunkNames = require('./async-chunk-names');
const sass = require('./sass');
const optimizeCss = require('./optimize-css');

module.exports = {
	clean,
	hmr,
	html,
	scriptExt,
	asyncChunkNames,
	sass,
	optimizeCss,
};
