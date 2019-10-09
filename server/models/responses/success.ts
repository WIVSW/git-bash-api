const Response = require('./response');

/**
 */
class Success extends Response {
	/**
	 * @param {Response.Data=} data
	 */
	constructor(data) {
		super({
			code: 200,
			message: 'OK',
			data,
		});
	}
};

module.exports = Success;
