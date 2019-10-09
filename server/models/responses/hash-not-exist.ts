const NotFound = require('./not-found');

/**
 */
class HashNotExist extends NotFound {
	/**
	 */
	constructor() {
		super('The commit or branch is don\'t exist');
	}
}

module.exports = HashNotExist;
