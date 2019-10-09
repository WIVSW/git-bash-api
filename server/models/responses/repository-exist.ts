const BadRequest = require('./bad-request');

/**
 */
class RepositoryAlreadyExist extends BadRequest {
	/**
	 */
	constructor() {
		super('The repository is already exist');
	}
};

module.exports = RepositoryAlreadyExist;
