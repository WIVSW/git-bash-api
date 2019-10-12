import Response from "./response";

export interface IFailInput {
	code: number;
	message: string;
}

class Fail extends Response<null> {
	constructor(data : IFailInput) {
		super({
			code: data.code,
			message: data.message,
			data: null,
		});
	}
};

export default Fail;
