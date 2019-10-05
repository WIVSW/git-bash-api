const {getAllRepos} = require('./helpers/repo');

const BRANCH = 'master';

describe('Page of the', () => {
	beforeEach(async () => {
		const REPO_NAMES = await getAllRepos();
		const TEST_DATA = {
			REPO_NAMES,
			BRANCH,
		};
		process.env.TEST_DATA = JSON.stringify(TEST_DATA);

		return TEST_DATA;
	});

	require('./pages/repository.test');
});
