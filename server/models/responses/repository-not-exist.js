const NotFound = require('./not-found');

/**
 */
class RepositoryNotExist extends NotFound {
	/**
	 */
	constructor() {
		super('The repository is not exist');
	}
};

module.exports = RepositoryNotExist;
