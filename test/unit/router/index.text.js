const path = require('path');
const sinon = require('sinon');
const express = require('express');
const request = require('supertest');

const PATH_TO_REPOS = path.resolve(__dirname, '../../../tmp');
process.env.PATH_TO_REPOS = PATH_TO_REPOS;

const TEST_PORT = 3050;
process.env.PORT = TEST_PORT;

const actions = {
	readReposList: () => {},
	removeRepo: () => {},
	downloadRepo: () => {},
	readCommitsList: () => {},
	listDir: () => {},
	readCommitDiff: () => {},
	readBlob: () => {},
};

const createServer = (actions) => {
	const router = require('../../../server/router')({actions});
	const app = express();
	app.use(express.json());
	app.use('/api', router);
	const agent = request.agent(app);

	return new Promise(((resolve) => {
		const server = app.listen(TEST_PORT, () => {
			resolve({
				app,
				agent,
				server,
			});
		});
	}));
};

const getUrl = (agent, url) => {
	return new Promise(((resolve, reject) => {
		agent
			.get(url)
			.end((err) => err ? reject(err) : resolve() );
	}));
};

const testWrapper = async (actions, test) => {
	const {server, agent} = await createServer(actions);

	await test(agent);

	await server.close();
};

describe('Router', () => {
	beforeEach(() => process.env.PATH_TO_REPOS = PATH_TO_REPOS);

	it('GET /api/repos calls readReposList', async () => {
		const mock = sinon.mock(actions);
		mock.expects('readReposList').once();

		await testWrapper(actions, async (agent) => {
			await getUrl(agent, '/api/repos');
			mock.verify();
		});
	});

	it('GET /api/repos/:repositoryId/commits/:commitHash ' +
		'calls readCommitsList', async () => {
		const REPO_ID = 'react';
		const HASH = 'master';
		const mock = sinon.mock(actions);
		mock.expects('readCommitsList').once().withArgs(REPO_ID, HASH);

		await testWrapper(actions, async (agent) => {
			await getUrl(agent, `/api/repos/${REPO_ID}/commits/${HASH}`);
			mock.verify();
		});
	});

	it('GET /api/repos/:repositoryId/commits/:commitHash/diff ' +
		'calls readCommitDiff', async () => {
		const REPO_ID = 'react';
		const HASH = 'master';
		const mock = sinon.mock(actions);
		mock.expects('readCommitDiff').once().withArgs(REPO_ID, HASH);

		await testWrapper(actions, async (agent) => {
			await getUrl(agent, `/api/repos/${REPO_ID}/commits/${HASH}/diff`);
			mock.verify();
		});
	});

	it('GET /api/repos/:repositoryId/tree/:commitHash/:path ' +
		'calls listDir', async () => {
		const REPO_ID = 'react';
		const HASH = 'master';
		const mock = sinon.mock(actions);
		mock.expects('listDir').once().withArgs(REPO_ID, HASH);

		await testWrapper(actions, async (agent) => {
			await getUrl(agent, `/api/repos/${REPO_ID}/tree/${HASH}`);
			mock.verify();
		});
	});
	it('GET /api/repos/:repositoryId/blob/:commitHash/:pathToFile ' +
		'calls readBlob');
	it('DELETE /api/repos/:repositoryId calls removeRepo');
	it('POST /api/repos calls downloadRepo');
});
