const {promisify} = require('util');
const fs = require('fs');
const express = require('express');
const repoRoute = require('./repository');
const parseRepoId = require('../middleware/parse-repository-id');

const router = express.Router();
const readdir = promisify(fs.readdir);

router.get('/repos/', async (req, res) => {
	const repoIds = await readdir(process.env.PATH_TO_REPOS);
	const repos = repoIds.map((id) => ({id}));

	res
		.status(200)
		.send({message: 'OK', data: repos});
});

router.use('/repos/:repositoryId/', parseRepoId, repoRoute);

module.exports = router;
