const path = require('path');
const request = require('supertest');

const PATH_TO_REPOS = path.resolve(__dirname, '../../../tmp');
process.env.PATH_TO_REPOS = PATH_TO_REPOS;

const TEST_PORT = 3050;
process.env.PORT = TEST_PORT;
const app = require('../../../server');
const agent = request.agent(app);

const actions = {
	readReposList: () => {},
	removeRepo: () => {},
	downloadRepo: () => {},
	readCommitsList: () => {},
	listDir: () => {},
	readCommitDiff: () => {},
	readBlob: () => {},
};

describe('Router', () => {
	beforeEach(() => process.env.PATH_TO_REPOS = PATH_TO_REPOS);

	it('GET /api/repos calls readReposList');
	it('GET /api/repos/:repositoryId/commits/:commitHash calls readCommitsList');
	it('GET /api/repos/:repositoryId/commits/:commitHash/diff ' +
		'calls readCommitDiff');
	it('GET /api/repos/:repositoryId/tree/:commitHash/:path calls listDir');
	it('GET /api/repos/:repositoryId/blob/:commitHash/:pathToFile ' +
		'calls readBlob');
	it('DELETE /api/repos/:repositoryId calls removeRepo');
	it('POST /api/repos calls downloadRepo');
});
