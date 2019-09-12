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

const getBodyFromResponse = ({res}) => JSON.parse(res.text).data;

describe('Basic CRUD test', () => {
	before(() => createEmptyRepos(PATH_TO_REPOS, REPOS_IDS));
	after(() => fse.remove(PATH_TO_REPOS));

	it('GET /api/repos return json of repos', (done) => {
		agent
			.get('/api/repos')
			.expect(200)
			.expect((response) => {
				const repos = getBodyFromResponse(response);
				assert.strictEqual(Array.isArray(repos), true);
				assert.strictEqual(repos.length, REPOS_IDS.length);
				assert.strictEqual(repos.every((r) => typeof r === 'object'), true);
				assert.strictEqual(repos.every((r) => REPOS_IDS.includes(r.id)), true);
			})
			.end(done);
	});

	it('POST /api/repos/:repositoryId create repo');
	it('DELETE /api/repos/:repositoryId delete repo');
});
