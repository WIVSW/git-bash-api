/**
 */
class Blob {
	/**
	 * @param {string} data
	 */
	constructor(data) {
		/**
		 * @type {Array<string>}
		 */
		this.rows = data.split('\n');
	}
}

export default Blob;
