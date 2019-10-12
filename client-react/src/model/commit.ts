import Hash, {IHash} from './hash';

export interface IMessage {
	subject: string;
	body: string;
}

export interface ICommit {
	author: string;
	timestamp: number;
	message: IMessage;
	hash?: IHash;
	parent?: IHash;
}

class Commit {
	readonly author : string;
	readonly date : Date;
	readonly subject? : string;
	readonly body? : string;
	readonly hash? : Hash;
	readonly parent? : Hash;

	constructor(data : ICommit) {
		this.author = data.author;
		this.date = new Date(data.timestamp);
		this.subject = (data.message && data.message.subject) || void 0;
		this.body = (data.message && data.message.body) || void 0;
		this.hash = (data.hash && new Hash(data.hash)) || void 0;
		this.parent = (data.parent && new Hash(data.parent)) || void 0;
	}
}

export default Commit;
