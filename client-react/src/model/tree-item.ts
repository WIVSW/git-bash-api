export enum Types {
	TREE = 'tree',
	BLOB = 'blob',
}

export interface ITreeItem {
	readonly mode : string;
	readonly name : string;
	readonly type : Types;
	readonly object : string;
}

class TreeItem {
	readonly mode : string;
	readonly name! : string;
	readonly type : Types;
	readonly object : string;

	constructor(data) {
		this.mode = data.type || null;
		this.name = data.name;
		this.type = data.type;
		this.object = data.object;
	}

	static isValid(raw : unknown) : boolean {
		if (!(Boolean(raw) && raw !== null && typeof raw === 'object')) {
			return false;
		}

		return typeof raw.mode === 'string' &&
			typeof raw.name === 'string' &&
			typeof raw.object === 'string' &&
			(
				typeof raw.type === Types.BLOB ||
				typeof raw.type === Types.TREE
			);
	}

	get isFile() : boolean {
		return this.type === Types.BLOB;
	}

	get isDir() : boolean {
		return this.type === Types.TREE;
	}
};


export default TreeItem;
