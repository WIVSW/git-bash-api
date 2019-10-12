import BadRequest from "./bad-request";

class RepositoryAlreadyExist extends BadRequest {
	constructor() {
		super('The repository is already exist');
	}
};

export default RepositoryAlreadyExist;
