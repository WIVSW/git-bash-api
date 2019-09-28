/**
 */
class Hash {
	/**
	 * @param {Object} data
	 */
	constructor(data) {
		/**
		 * @type {Array<string>}
		 */
		this.short = data.short;

		/**
		 * @type {Array<string>}
		 */
		this.full = data.full;
	}
}

export default Hash;
