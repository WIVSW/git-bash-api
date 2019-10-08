import Connection from '../module/connection';
import CommitsApi from './commits';
import ReposApi from './repos';

/**
 */
class ApiContainer {
	readonly commits : CommitsApi;
	readonly repos : ReposApi;

	constructor() {
		const connection : Connection = new Connection();

		this.commits = new CommitsApi(connection);
		this.repos = new ReposApi(connection);
	}
}

const api = new ApiContainer();

export default api;
