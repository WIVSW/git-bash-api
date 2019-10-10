import Response, {Data} from "./response";

class Success extends Response {
	constructor(data : Data) {
		super({
			code: 200,
			message: 'OK',
			data,
		});
	}
};

export default Success;
