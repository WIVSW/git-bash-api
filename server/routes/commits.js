const express = require('express');
const router = express.Router();

const {handleRequest} = require('../modules/utils');

router.get('/', handleRequest.bind(null, async (req) => {
	return [];
}));

module.exports = router;
