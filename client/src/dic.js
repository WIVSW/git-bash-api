import Connection from './module/connection';
import CommitsApi from './api/commits';
import ReposApi from './api/repos';

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

		/**
		 * @type {ReposApi}
		 */
		this.api.repos = new ReposApi(connection);
	}
}

export default DIC;
