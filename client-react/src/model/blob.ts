export interface IRawBlob {
	id: string;
	blob: string;
	url: string;
}

class Blob {
	readonly id : string;
	readonly rows : string[];
	readonly url : string;
	readonly filename : string;

	constructor(data : IRawBlob) {
		this.id = data.id || '';
		this.rows = typeof data.blob === 'string' ?
			data.blob.split('\n') : [];
		this.url = data.url || '';
		this.filename = this.url
			.split('/')
			.slice(-1)[0] || '';
	}

	static createId(
		repoId : string,
		hash : string = 'master',
		path : string = ''
	) : string {
		return `${repoId}#${hash}#${path}`;
	}
}

export default Blob;
