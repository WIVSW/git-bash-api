import Fail from "./fail";

class NotFound extends Fail {
	constructor(optMessage? : string) {
		super({
			code: 404,
			message: optMessage || 'Not found',
		});
	}
};

export default NotFound;
