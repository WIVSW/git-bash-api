import Response, {Data} from "./response";

export interface FailInput {
	code: number;
	message: string;
}

class Fail extends Response {
	constructor(data : FailInput) {
		super({
			code: data.code,
			message: data.message,
			data: null,
		});
	}
};

export default Fail;
