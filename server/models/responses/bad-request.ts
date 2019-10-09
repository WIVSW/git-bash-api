const Fail = require('./fail');

/**
 */
class BadRequest extends Fail {
	/**
	 * @param {string=} optMessage
	 */
	constructor(optMessage) {
		super({
			code: 400,
			message: optMessage || 'Bad Request',
		});
	}
};

module.exports = BadRequest;
