const assert = require('assert');
const sinon = require('sinon');

const {getCommitFormat} = require('../../../server/modules/utils');
const commitsActions = require('../../../server/modules/commits-actions');
const repositoryActions = require('../../../server/modules/repository-actions');

const deps = {
	execute: () => Promise.resolve({stdout: ''}),
	spawnCmd: () => Promise.resolve(),
	commitsHistoryParser: () => {},
};

describe('Action', () => {
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
});
