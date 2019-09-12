const {promisify} = require('util');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const readdir = promisify(fs.readdir);

router.get('/repos/', async (req, res) => {
	const repoIds = await readdir(process.env.PATH_TO_REPOS);
	const repos = repoIds.map((id) => ({id}));

	res
		.status(200)
		.send({message: 'OK', data: repos});
});

module.exports = router;
