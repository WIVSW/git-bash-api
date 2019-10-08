export interface IHash {
	short: string;
	full: string;
}

/**
 */
class Hash {
	readonly short : string;
	readonly full : string;

	constructor(data: IHash) {
		this.short = data.short;
		this.full = data.full;
	}
}

export default Hash;
