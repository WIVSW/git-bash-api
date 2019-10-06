const fse = require('fs-extra');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const createEmptyRepo = async (path, id) => await exec(
	`cd ${path} && git init ${id}`
);

module.exports = async (reposPath, reposIds) => {
	await fse.ensureDir(reposPath);
	return await Promise.all(reposIds
		.map((id) => createEmptyRepo(reposPath, id))
	);
};
