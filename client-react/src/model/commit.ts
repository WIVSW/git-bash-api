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
		/**
		 * @type {string}
		 */
		this.author = data.author;

		/**
		 * @type {Date}
		 */
		this.date = new Date(data.timestamp);

		/**
		 * @type {?string}
		 */
		this.subject = (data.message && data.message.subject) || null;

		/**
		 * @type {?string}
		 */
		this.body = (data.message && data.message.body) || null;

		/**
		 * @type {?Hash}
		 */
		this.hash = (data.hash && new Hash(data.hash)) || null;

		/**
		 * @type {?Hash}
		 */
		this.parent = (data.parent && new Hash(data.parent)) || null;
	}
}

export default Commit;
