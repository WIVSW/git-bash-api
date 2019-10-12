import NotFound from './not-found';

class RepositoryNotExist extends NotFound {
	constructor() {
		super('The repository is not exist');
	}
};

export default RepositoryNotExist;
