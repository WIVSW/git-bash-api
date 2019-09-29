import Connection from './module/connection';
import CommitsApi from './api/commits';
import ReposApi from './api/repos';
import Store from './store/store';
import PromiseMiddleware from './module/promise-middleware';

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

		/**
		 * @type {Store}
		 */
		this.store = Store.createStore(
			(...args) => console.log('reduce', ...args),
			{trees: []},
			PromiseMiddleware
		);
	}
}

export default DIC;
