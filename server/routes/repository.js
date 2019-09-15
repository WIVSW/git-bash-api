const express = require('express');
const router = express.Router();

const parseCommitHash = require('../middleware/parse-commit-hash');
const commitsRoute = require('./commits');
const filesRoute = require('./files');

const {removeRepo, downloadRepo} = require('../modules/actions');
const {handleRequest} = require('../modules/utils');


router.get('/', (req, res) => {
	res.redirect(`/api/repos/${req.repositoryId}/tree/master`);
});

router.post('/', handleRequest.bind(null, async (req) => {
	const {repositoryId: id, body: {url}} = req;
	await downloadRepo(id, url);
	return [{id}];
}));

router.delete('/', handleRequest.bind(null, async (req) => {
	const {repositoryId: id} = req;
	await removeRepo(id);
	return [{id}];
}));

router.use('/commits/:hash/', parseCommitHash, commitsRoute);

router.use('/tree/:hash', parseCommitHash, filesRoute);

module.exports = router;
