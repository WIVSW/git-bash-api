const Fail = require('./fail');

/**
 */
class NotFound extends Fail {
	/**
	 */
	constructor() {
		super({
			code: 404,
			message: 'Not found',
		});
	}
};

module.exports = NotFound;
