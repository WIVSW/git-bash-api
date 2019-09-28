import Connection from './module/connection';
import CommitsApi from './api/commits';

/**
 */
class DIC {
	/**
	 */
	constructor() {
		/**
		 * @type {Object<Api>}
		 */
		this.api = {};

		const connection = new Connection();

		/**
		 * @type {CommitsApi}
		 */
		this.api.commits = new CommitsApi(connection);
	}
}

export default DIC;
