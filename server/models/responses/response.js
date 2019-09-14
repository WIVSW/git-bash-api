/**
 */
class Response {
	/**
	 * @param {Response.Input} input
	 */
	constructor(input) {
		/**
		 * @type {number}
		 */
		this.code = input.code;

		/**
		 * @type {string}
		 */
		this.message = input.message;

		/**
		 * @type {?Response.Data}
		 */
		this.data = input.data || null;
	}
}


/**
 * @typedef {Array|Object}
 */
Response.Data;


/**
 * @typedef {{
 *     code: number,
 *     message: string,
 *     data: Response.Data=
 * }}
 */
Response.Input;

module.exports = Response;
