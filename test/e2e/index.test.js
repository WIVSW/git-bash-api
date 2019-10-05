const {getAllRepos} = require('./helpers/repo');

const BRANCH = 'master';

describe('', () => {
	beforeEach(async () => {
		const REPO_NAMES = await getAllRepos();
		const TEST_DATA = {
			REPO_NAMES,
			BRANCH,
		};
		process.env.TEST_DATA = JSON.stringify(TEST_DATA);

		return TEST_DATA;
	});

	describe('Page of the', () => {
		require('./pages/files-list.test');
		require('./pages/blob.test');
	});

	require('./transition.test');
});
