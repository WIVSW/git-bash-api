const assert = require('assert');
const request = require('supertest');
const path = require('path');
const fse = require('fs-extra');

const createEmptyRepos = require('../helpers/create-empty-repos');
const PATH_TO_REPOS = path.resolve(__dirname, './test-repos');
const REPOS_IDS = ['test-repos-1', 'test-repos-2'];

process.env.PATH_TO_REPOS = PATH_TO_REPOS;

const app = require('../../server');
const agent = request.agent(app);

describe('Basic CRUD test', () => {
	before(() => createEmptyRepos(PATH_TO_REPOS, REPOS_IDS));
	after(() => fse.remove(PATH_TO_REPOS));

	it('GET Hello World!', function(done) {
		agent
			.get('/')
			.expect(200)
			.expect(
				({res}) =>
					assert.strictEqual(res.text, 'Hello World!')
			)
			.end(done);
	});

	it('GET /api/repos return json of repos');
	it('POST /api/repos/:repositoryId create repo');
	it('DELETE /api/repos/:repositoryId delete repo');
});
