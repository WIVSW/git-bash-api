const Fail = require('./fail');

/**
 */
class NotFound extends Fail {
	/**
	 * @param {string=} optMessage
	 */
	constructor(optMessage) {
		super({
			code: 404,
			message: optMessage || 'Not found',
		});
	}
};

module.exports = NotFound;
