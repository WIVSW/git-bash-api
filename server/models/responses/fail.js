const Response = require('./response');

/**
 */
class Fail extends Response {
	/**
	 * @param {Fail.Input} data
	 */
	constructor(data) {
		super({
			code: data.code,
			message: data.message,
			data: null,
		});
	}
};


/**
 * @typedef {{
 *     code: number,
 *     message: string
 * }}
 */
Fail.Input;

module.exports = Fail;
