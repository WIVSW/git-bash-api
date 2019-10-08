export enum Types {
	TREE = 'tree',
	BLOB = 'blob',
}

export interface ITreeItem {
	mode : string;
	name : string;
	type : Types;
	object : string;
}

class TreeItem {
	readonly mode : string;
	readonly name : string;
	readonly type : Types;
	readonly object : string;

	constructor(data : ITreeItem) {
		this.mode = data.type || null;
		this.name = data.name;
		this.type = data.type;
		this.object = data.object;
	}

	get isFile() : boolean {
		return this.type === Types.BLOB;
	}

	get isDir() : boolean {
		return this.type === Types.TREE;
	}
};


export default TreeItem;
