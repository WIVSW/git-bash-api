import Hash from './hash';

/**
 */
class Commit {
	/**
	 * @param {Object} data
	 */
	constructor(data) {
		/**
		 * @type {string}
		 */
		this.author = data.author;

		/**
		 * @type {Date}
		 */
		this.date = new Date(data.timestamp);

		/**
		 * @type {?string}
		 */
		this.subject = (data.message && data.message.subject) || null;

		/**
		 * @type {?string}
		 */
		this.body = (data.message && data.message.body) || null;

		/**
		 * @type {?Hash}
		 */
		this.hash = (data.hash && new Hash(data.hash)) || null;

		/**
		 * @type {?Hash}
		 */
		this.parent = (data.parent && new Hash(data.hash)) || null;
	}
}

export default Commit;
