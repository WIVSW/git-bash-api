import Connection from '../module/connection';
import CommitsApi from './commits';
import ReposApi from './repos';

/**
 */
class ApiContainer {
	/**
	 */
	constructor() {
		const connection = new Connection();

		/**
		 * @type {CommitsApi}
		 */
		this.commits = new CommitsApi(connection);

		/**
		 * @type {ReposApi}
		 */
		this.repos = new ReposApi(connection);
	}
}

const api = new ApiContainer();

export default api;
