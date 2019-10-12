import Response from "./response";

class Success<Data> extends Response<Data> {
	constructor(data : Data) {
		super({
			code: 200,
			message: 'OK',
			data,
		});
	}
};

export default Success;
