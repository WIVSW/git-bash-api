import Api from './api';
import TreeItem from '../model/tree-item';
import Commit from '../model/commit';

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
	 * @param {string=} source (branchName|commitHash)
	 * @param {string=} path
	 * @return {Promise<Array<TreeItem>>}
	 */
	async getFiles(repoId, source = 'master', path = '') {
		const datas = await this
			._request(
				`/repos/${this._uri(repoId)}/` +
				`tree/${this._uri(source)}/` +
				`${this._uri(path)}/`
			);
		return datas.map((data) => new TreeItem(data));
	}

	/**
	 * @param {string} repoId
	 * @param {string=} source (branchName|commitHash|filename)
	 * @param {number=} offset
	 * @param {number=} limit
	 * @return {Promise<Object>}
	 */
	async getHistory(repoId, source, offset, limit) {
		let url = `/repos/${this._uri(repoId)}/commits/${this._uri(source)}`;
		if (limit) {
			offset = offset || 0;
			url = `${url}/offset/${offset}/limit/${limit}/`;
		}
		const datas = await this._request(url);
		return datas.map((data) => new Commit(data));
	}
}

export default CommitsApi;
