export interface Input {
	code: number,
	message: string,
	data: Data
}

export type Data = [] | object | null;

class Response {
	readonly code: number;
	readonly message: string;
	readonly data: Data;

	constructor(input : Input) {
		this.code = input.code;
		this.message = input.message;
		this.data = input.data || null;
	}
}

export default Response;
