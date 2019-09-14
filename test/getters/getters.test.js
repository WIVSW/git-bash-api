const path = require('path');
const fse = require('fs-extra');

const createRepos = require('../helpers/create-repos');
const PATH_TO_REPOS = path.resolve(__dirname, './test-repos');
const REPOS = [
	{
		name: 'test-repo-1',
		branches: [
			{
				name: 'test-branch-1',
				commits: [
					{
						message: 'Test commit 1',
						changes: {
							'test-file-1.txt': 'Test content 1',
							'test-file-2.txt': 'Test content 1',
						},
					},
					{
						message: 'Test commit 2',
						changes: {
							'test-file-1.txt': 'Test content 2',
							'test-file-2.txt': 'Test content 2',
						},
					},
					{
						message: 'Test commit 3',
						changes: {
							'test-file-1.txt': 'Test content 3',
							'test-file-2.txt': 'Test content 3',
						},
					},
					{
						message: 'Test commit 4',
						changes: {
							'test-file-1.txt': 'Test content 4',
							'test-file-2.txt': 'Test content 4',
						},
					},
					{
						message: 'Test commit 5',
						changes: {
							'test-file-1.txt': 'Test content 5',
							'test-file-2.txt': 'Test content 5',
						},
					},
					{
						message: 'Test commit 6',
						changes: {
							'test-file-1.txt': 'Test content 6',
							'test-file-2.txt': 'Test content 6',
						},
					},
					{
						message: 'Test commit 7',
						changes: {
							'test-file-1.txt': 'Test content 7',
							'test-file-2.txt': 'Test content 7',
						},
					},
					{
						message: 'Test commit 8',
						changes: {
							'test-file-1.txt': 'Test content 8',
							'test-file-2.txt': 'Test content 8',
						},
					},
					{
						message: 'Test commit 9',
						changes: {
							'test-file-1.txt': 'Test content 9',
							'test-file-2.txt': 'Test content 9',
						},
					},
					{
						message: 'Test commit 10',
						changes: {
							'test-file-1.txt': 'Test content 10',
							'test-file-2.txt': 'Test content 10',
						},
					},
				],
			},
		],
	},
];

process.env.PATH_TO_REPOS = PATH_TO_REPOS;

describe('Getters test', () => {
	before(
		() => createRepos(PATH_TO_REPOS, REPOS)
			.then((repos) => {
				process.env.TEST_REPOS = JSON.stringify(REPOS);
			})
	);
	after(() => fse.remove(PATH_TO_REPOS));

	require('./commits.test');
});
