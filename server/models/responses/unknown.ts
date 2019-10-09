const Fail = require('./fail');

/**
 */
class Unknown extends Fail {
	/**
	 */
	constructor() {
		super({
			code: 500,
			message: 'Unknown error',
		});
	}
};

module.exports = Unknown;
