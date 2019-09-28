const express = require('express');
const repoRoute = require('./repository');
const parseRepoId = require('../middleware/parse-repository-id');
const {readReposList} = require('../modules/actions');
const {handleRequest} = require('../modules/utils');

const router = express.Router();

router.get('/repos/', handleRequest.bind(null, readReposList.bind(null)));

router.use('/repos/:repositoryId/', parseRepoId, repoRoute);

module.exports = router;
