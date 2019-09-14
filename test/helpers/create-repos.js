const fse = require('fs-extra');
const {resolve} = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const execute = async (cmd, path) => await exec(cmd, {
	cwd: path,
});

const sequence = (array, fn) =>
	array.reduce((prev, curr) => prev.then(() => fn(curr)), Promise.resolve());

const createCommit = async (commit, repoPath) => {
	const {changes, message} = commit;
	const run = async (cmd) => await execute(cmd, repoPath);
	await Promise.all(Object.keys(changes).map(async (file) => {
		const path = resolve(repoPath, `./${file}`);
		await fse.ensureFile(path);
		await fse.writeFile(path, changes[file]);
	}));
	await run(`git add .`);
	await run(`git commit -m "${message}"`);
	const logs = await run(`git log --max-count=1 --pretty="%h"`);

	commit.hash = logs.stdout.trim();

	return commit;
};

const createBranch = async (branch, repoPath) => {
	const {commits, name} = branch;
	await execute(`git checkout -b ${name}`, repoPath);
	await sequence(
		commits,
		(commit) => createCommit(commit, repoPath)
	);

	return branch;
};

const createRepo = async (reposPath, repo) => {
	const {name, branches} = repo;
	const path = resolve(reposPath, `./${name}`);

	await execute(`git init ${name}`, reposPath);
	await sequence(
		branches,
		(branch) => createBranch(branch, path)
	);

	return repo;
};

module.exports = async (reposPath, repos) => {
	await fse.ensureDir(reposPath);
	return await sequence(
		repos,
		(repo) => createRepo(reposPath, repo)
	);
};
