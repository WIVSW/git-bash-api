const assert = require('assert');
const sinon = require('sinon');
const path = require('path');

const {getCommitFormat} = require('../../../server/modules/utils');
const commitsActions = require('../../../server/modules/commits-actions');
const repositoryActions = require('../../../server/modules/repository-actions');

const deps = {
	execute: () => Promise.resolve({stdout: ''}),
	spawnCmd: () => Promise.resolve(),
	commitsHistoryParser: () => {},
	removeRecursive: () => {},
	readdir: () => [],
};

describe('Action', () => {
	beforeEach(() => {
		process.env.PATH_TO_REPOS = path.resolve(__dirname, '../../../tmp');
	});
	it('getCommitsList will call git log', async () => {
		const mock = sinon.mock(deps);
		const args = [
			'log',
			`--pretty="${getCommitFormat()}"`,
			'master',
		];
		mock.expects('spawnCmd').once().withArgs('git', args, 'react');
		const {getCommitsList} = commitsActions(deps);
		await getCommitsList('react', 'master');
		mock.verify();
	});

	it('getFilesList will call git ls-tree', async () => {
		const mock = Object.assign({}, deps);
		const args = [
			'--no-pager',
			'ls-tree',
			'master',
		];
		const spy = sinon.spy(mock, 'execute');
		const {getFilesList} = commitsActions(mock);

		await getFilesList('react', 'master');
		assert.ok(spy.calledWith('git', args, 'react/'),
			'Expected call git --no-pager ls-tree');
	});

	it('getCommitDiff will call git show', async () => {
		const mock = sinon.mock(deps);
		const args = [
			'show',
			'master',
		];
		mock.expects('spawnCmd').once().withArgs('git', args, 'react');
		const {getCommitDiff} = commitsActions(deps);
		await getCommitDiff('react', 'master');
		mock.verify();
	});

	it('getBlob will call git cat-file', async () => {
		const mock = sinon.mock(deps);
		const args = [
			'cat-file',
			`master:./`,
			'-p',
		];
		mock.expects('spawnCmd').once().withArgs('git', args, 'react');
		const {getBlob} = commitsActions(deps);
		await getBlob('react', 'master', './');
		mock.verify();
	});

	it('download will call git clone', async () => {
		const mock = sinon.mock(deps);
		const args = [
			'clone',
			`ssh://github.com/facebook/react/`,
			'test-folder',
		];
		mock.expects('execute').once().withArgs('git', args);
		const {download} = repositoryActions(deps);
		await download('test-folder', 'ssh://github.com/facebook/react/');
		mock.verify();
	});

	it('remove will call remove recursive', async () => {
		const mock = sinon.mock(deps);
		const file = path.resolve(process.env.PATH_TO_REPOS, './react');
		mock.expects('removeRecursive').once().withArgs(file);
		const {remove} = repositoryActions(deps);
		await remove('react');
		mock.verify();
	});

	it('getReposList will readdir', async () => {
		const mock = Object.assign({}, deps);
		const spy = sinon.spy(mock, 'readdir');
		const {getReposList} = repositoryActions(mock);
		await getReposList();
		assert.ok(spy.calledWith(process.env.PATH_TO_REPOS),
			'Expected call utils#readdir');
	});
});
