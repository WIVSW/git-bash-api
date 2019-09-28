/**
 */
class Api {
	/**
	 * @param {Connection} connection
	 */
	constructor(connection) {
		/**
		 * @type {Connection}
		 * @private
		 */
		this._connection = connection;
	}

	/**
	 * @param {string} url
	 * @param {string=} method
	 * @param {Object=} postData
	 * @return {Promise<Object>}
	 * @protected
	 */
	async _request(url, method, postData) {
		return await this._connection.request(url, method, postData);
	}
}

export default Api;