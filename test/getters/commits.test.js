const assert = require('assert');
const request = require('supertest');
const app = require('../../server');
const agent = request.agent(app);

const getBodyFromResponse = ({res}) => JSON.parse(res.text).data;

describe('Commits tests', () => {
	describe('GET /api/repos/:repositoryId/commits/:commitHash', () => {
		const url = (id, hash) => `/api/repos/${id || ''}/commits/${hash || ''}`;
		it('All props exist', (done) => {
			const TEST_REPOS = JSON.parse(process.env.TEST_REPOS);
			const repository = TEST_REPOS[0];
			const branch = repository.branches[0];
			const commit = branch.commits[1];

			agent
				.get(url(repository.name, commit.hash))
				.expect(200)
				.expect((response) => {
					const c = getBodyFromResponse(response);
					const {strictEqual} = assert;
					strictEqual(Array.isArray(c), true,
						'Expect commits to be Array');
					strictEqual(c.length, 2,
						'Expect to receive 2 commits');
					strictEqual(typeof c[0].author, 'string',
						'Expect commit author field to be specified');
					strictEqual(typeof c[0].hash, 'object',
						'Expect commit hash to be specified');
					strictEqual(typeof c[0].hash.full.length, 'number',
						'Expect full commit hash to be specified');
					strictEqual(typeof c[0].hash.short.length, 'number',
						'Expect short commit hash to be specified');
					strictEqual(typeof c[0].message, 'object',
						'Expect commit message to be specified');
					strictEqual(typeof c[0].message.subject, 'string',
						'Expect commit message subject to be specified');
					strictEqual(typeof c[0].parent, 'object',
						'Expect commit parent to be specified');
					strictEqual(Array.isArray(c[0].parent.full), true,
						'Expect commit parent full to be specified');
					strictEqual(Array.isArray(c[0].parent.short), true,
						'Expect commit parent short to be specified');
					strictEqual(typeof c[0].timestamp, 'number',
						'Expect commit timestamp to be specified');
				})
				.end(done);
		});

		it('Can get commits by branch name', (done) => {
			const TEST_REPOS = JSON.parse(process.env.TEST_REPOS);
			const repository = TEST_REPOS[0];
			const branch = repository.branches[0];

			agent
				.get(url(repository.name, branch.name))
				.expect(200)
				.expect((response) => {
					const commits = getBodyFromResponse(response);
					const {strictEqual} = assert;
					strictEqual(Array.isArray(commits), true,
						'Expect commits to be Array');
					strictEqual(commits.length, branch.commits.length,
						`Expect to receive ${branch.commits.length} commits`);
				})
				.end(done);
		});

		it('return 404 if repository don\'t exist', (done) => {
			const TEST_REPOS = JSON.parse(process.env.TEST_REPOS);
			const repository = TEST_REPOS[0];
			const branch = repository.branches[0];

			agent
				.get(url('asdfhjajskjbjwbhghashasdfhlkhasjdf', branch.name))
				.expect(404)
				.end(done);
		});

		it('return 404 if repository don\'t exist', (done) => {
			const TEST_REPOS = JSON.parse(process.env.TEST_REPOS);
			const repository = TEST_REPOS[0];

			agent
				.get(url(repository.name, 'asdfghagsdhjfakjsbdhfdks'))
				.expect(404)
				.end(done);
		});
	});
});
