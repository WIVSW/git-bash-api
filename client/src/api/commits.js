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
	 * @param {string} source (branchName|commitHash|filename)
	 * @param {number=} offset
	 * @param {number=} limit
	 * @return {Promise<Commit>}
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

	/**
	 * @param {string} repoId
	 * @param {string} pattern
	 * @param {string=} source (branchName|commitHash)
	 * @param {string=} path
	 * @return {Promise<Array<CommitsApi.TreeInfo>>}
	 */
	async searchTrees(repoId, pattern, source = 'master', path = '') {
		const infoMap = {};
		const items = await this.getFiles(repoId, source, path);
		const matches = items.filter((item) =>
			item.name.toLowerCase()
				.includes(pattern.toLowerCase())
		);

		matches.forEach((item) => infoMap[item.name] = {treeItem: item});

		await Promise.all(
			items
				.filter((item) =>
					item.name.toLowerCase()
						.includes(pattern.toLowerCase())
				)
				.map(async (item) => {
					const filepath = path ? `${path}/${item.name}` : item.name;
					const commits = await this.getHistory(repoId, filepath, 0, 1);
					infoMap[item.name].commit = commits[0];
				})
		);

		return Object.values(infoMap);
	}
}


/**
 * @typedef {{
 *     treeItem: TreeItem,
 *     commit: Commit
 * }}
 */
CommitsApi.TreeInfo;

export default CommitsApi;
