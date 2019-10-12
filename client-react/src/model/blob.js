/**
 */
class Blob {
	/**
	 * @param {Object} data
	 */
	constructor(data) {
		/**
		 * @param {string}
		 */
		this.id = data.id || '';

		/**
		 * @type {Array<string>}
		 */
		this.rows = typeof data.blob === 'string' ?
			data.blob.split('\n') : [];

		/**
		 * @type {string}
		 */
		this.url = data.url || '';

		/**
		 * @type {string}
		 */
		this.filename = this.url
			.split('/')
			.slice(-1)[0] || '';
	}

	/**
	 * @param {string} repoId
	 * @param {string=} hash
	 * @param {string=} path
	 * @returns {string}
	 */
	static createId(repoId, hash = 'master', path = '') {
		return `${repoId}#${hash}#${path}`;
	}
}

export default Blob;
