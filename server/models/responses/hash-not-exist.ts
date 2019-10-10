import NotFound from "./not-found";

class HashNotExist extends NotFound {
	constructor() {
		super('The commit or branch is don\'t exist');
	}
}

export default HashNotExist;
