import Api from './api';

/**
 */
class CommitsApi extends Api {
	/**
	 * @param {Connection} connection
	 */
	constructor(connection) {
		super(connection);
	}

	/**
	 * @param {string} repoId
	 * @param {string=} source (branchName|commitHash|filename)
	 * @param {string=} path
	 * @return {Promise<Object>}
	 */
	async getFiles(repoId, source = 'master', path = '') {
		return await this._request(`/repos/${repoId}/tree/${source}/${path}`);
	}
}

export default CommitsApi;