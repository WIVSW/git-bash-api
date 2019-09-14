const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const exists = promisify(fs.exists);

const isRemoteRepoExist = async (url) => {
	try {
		const {status} = await axios.get(url);
		return status === 200;
	} catch (error) {
		return false;
	}
};

const isRepoExist = async (repoId) => {
	const repoPath = path.resolve(process.env.PATH_TO_REPOS, `./${repoId}`);
	try {
		return await exists(repoPath);
	} catch (error) {
		return false;
	}
};

const check = async (action, expected, error) => {
	const status = await action();

	if (status !== expected) {
		throw error;
	}
};

router.post('/', async (req, res) => {
	const {repositoryId, body: {url}} = req;
	try {
		let isUrlValid;
		if (url.includes('http')) {
			// Проверка на то, что репозиторий является публичным
			// и мы можем его скачать
			isUrlValid = await isRemoteRepoExist(url);
		} else {
			// Теоретически url-ом может быть ssh url
			// и я подразумеваю, что если есть ssh url,
			// то есть и ssh ключ.
			isUrlValid = true;
		}

		if (!isUrlValid) {
			throw new Error('Invalid url');
		}

		await Promise.all([
			url.includes('http') ?
				check(
					isRemoteRepoExist.bind(null, url),
					true,
					new Error('Invalid url')
				) :	Promise.resolve(),
			check(
				isRepoExist.bind(null, repositoryId),
				false,
				new Error('The repository already exist')
			),
		]);

		await exec(
			`git clone ${url} ${repositoryId}`,
			{
				cwd: process.env.PATH_TO_REPOS,
			}
		);
		res
			.status(200)
			.send({message: 'OK', data: [{
				id: repositoryId,
			}]});
	} catch (error) {
		res
			.status(404)
			.send({message: 'Not found', data: null});
	}
});

router.delete('/', async (req, res) => {
	const {repositoryId} = req;
	try {
		await exec(
			`cd ${process.env.PATH_TO_REPOS} && rm -rf ${repositoryId}`
		);
		res
			.status(200)
			.send({message: 'OK', data: [{
				id: repositoryId,
			}]});
	} catch (error) {
		res
			.status(400)
			.send({message: 'Not found', data: null});
	}
});

module.exports = router;
