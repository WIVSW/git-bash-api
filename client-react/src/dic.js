import Connection from './module/connection';
import CommitsApi from './api/commits';
import ReposApi from './api/repos';
import { createStore } from 'redux';

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
		this.store = createStore(
			(state) => state,
			{
				repos: [
					{ id: 'some-name'}
				],
				trees: [],
			}
		)
	}
}

export default DIC;
