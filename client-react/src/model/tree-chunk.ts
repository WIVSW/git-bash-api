import {ITree} from "../api/commits";

export interface ITreeChunk {
	repoId: string;
	path: string;
	trees: ITree[];
}

class TreeChunk {
	readonly repoId: string;
	readonly path: string;
	readonly trees: ITree[];

	constructor(data : ITreeChunk) {
		this.repoId = data.repoId;
		this.path = data.path;
		this.trees = data.trees;
	}
}

export default TreeChunk;
