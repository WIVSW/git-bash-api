import Fail from "./fail";

class Unknown extends Fail {
	constructor() {
		super({
			code: 500,
			message: 'Unknown error',
		});
	}
};

export default Unknown;
