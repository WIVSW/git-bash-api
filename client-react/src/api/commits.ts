import Api from './api';
import TreeItem, {ITreeItem} from '../model/tree-item';
import Commit, {ICommit} from '../model/commit';
import Blob from "../model/blob";

export interface ITree {
	commit: Commit;
	treeItem: TreeItem;
}

class CommitsApi extends Api {
	async getFiles(
		repoId : string,
		source : string = 'master',
		path : string = ''
	) : Promise<TreeItem[]> {
		const fullpath : string = path ? `${this._uri(path)}/` : '';
		const datas : ITreeItem[] = await this
			._request<ITreeItem[]>(
				`/repos/${this._uri(repoId)}/` +
				`tree/${this._uri(source)}/` +
				`${fullpath}`
			);

		return datas.map((data : ITreeItem) => new TreeItem(data));
	}

	async getHistory(
		repoId : string,
		source : string,
		offset? : number,
		limit? : number
	) : Promise<Commit[]> {
		let url : string = `/repos/${this._uri(repoId)}/commits/${this._uri(source)}`;
		if (limit) {
			offset = offset || 0;
			url = `${url}/offset/${offset}/limit/${limit}/`;
		}
		const datas : ICommit[] = await this._request<ICommit[]>(url);

		return datas.map((data : ICommit) => new Commit(data));
	}

	async getTrees(
		repoId : string,
		pattern : string = '',
		source : string = 'master',
		path : string = ''
	) : Promise<ITree[]> {
		const treeItems : { [key: string]: TreeItem } = {};
		const commitsMap : { [key: string] : Commit } = {};
		const items : TreeItem[] = await this.getFiles(repoId, source, path);
		const matches : TreeItem[] = items.filter((item : TreeItem) =>
			item.name.toLowerCase()
				.includes(pattern.toLowerCase())
		);

		matches.forEach((item : TreeItem) => treeItems[item.name] = item);

		await Promise.all(
			matches
				.map(async (item : TreeItem) => {
					const filepath : string = path ? `${path}/${item.name}` : item.name;
					const commits : Commit[] = await this.getHistory(repoId, filepath, 0, 1);
					commitsMap[item.name] = commits[0];
				})
		);

		return matches.map((item : TreeItem) => ({
			treeItem: treeItems[item.name],
			commit: commitsMap[item.name]
		}));
	}

	async getBlob(
		repoId : string,
		hash : string = 'master',
		path? : string
	) : Promise<Blob> {
		let url = `/repos/${this._uri(repoId)}/blob/${this._uri(hash)}`;
		if (path) {
			url += `/${this._uri(path)}`
		}

		const blob = await this._request<string>(url);

		return new Blob({
			id: Blob.createId(repoId, hash, path),
			blob,
			url: decodeURIComponent(url)
		});
	}
}

export default CommitsApi;
