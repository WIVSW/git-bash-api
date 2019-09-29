const dev = require('./webpack/development.config');
const prod = require('./webpack/production.config');

let config;

switch (process.env.NODE_ENV) {
case 'production':
	config = prod;
	break;
default:
	config = dev;
}

module.exports = config;
