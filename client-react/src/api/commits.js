import Api from './api';
import TreeItem from '../model/tree-item';
import Commit from '../model/commit';
import Blob from "../model/blob";

/**
 */
class CommitsApi extends Api {
	/**
	 * @param {string} repoId
	 * @param {string=} source (branchName|commitHash)
	 * @param {string=} path
	 * @return {Promise<Array<TreeItem>>}
	 */
	async getFiles(repoId, source = 'master', path = '') {
		const fullpath = path ? `${this._uri(path)}/` : '';
		const datas = await this
			._request(
				`/repos/${this._uri(repoId)}/` +
				`tree/${this._uri(source)}/` +
				`${fullpath}`
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
	 * @param {string=} pattern
	 * @param {string=} source (branchName|commitHash)
	 * @param {string=} path
	 * @return {Promise<Array<{
	 *     treeItem: TreeItem,
	 *     commit: Commit
	 * }>>}
	 */
	async getTrees(repoId, pattern = '', source = 'master', path = '') {
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

		return Object.values(infoMap)
	}

	/**
	 * @param {string} repoId
	 * @param {string=} hash (branchName|commitHash)
	 * @param {string=} path
	 * @return {Promise<Blob>}
	 */
	async getBlob(repoId, hash = 'master', path) {
		let url = `/repos/${this._uri(repoId)}/blob/${this._uri(hash)}`;
		if (path) {
			url += `/${this._uri(path)}`
		}

		const blob = await this._request(url);

		return new Blob({
			id: Blob.createId(repoId, hash, path),
			blob,
			url: decodeURIComponent(url)
		});
	}
}

export default CommitsApi;