import Fail from "./fail";

class BadRequest extends Fail {
	constructor(optMessage : string) {
		super({
			code: 400,
			message: optMessage || 'Bad Request',
		});
	}
};

export default BadRequest;
