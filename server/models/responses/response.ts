export interface Input<Data> {
	code: number,
	message: string,
	data: Data
}

class Response<Data> {
	readonly code: number;
	readonly message: string;
	readonly data: Data;

	constructor(input : Input<Data>) {
		this.code = input.code;
		this.message = input.message;
		this.data = input.data;
	}
}

export default Response;
