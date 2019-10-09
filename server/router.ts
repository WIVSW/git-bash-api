module.exports = ({actions}) => {
	const commitsRoute = require('./routes/commits')({
		actions,
	});
	const filesRoute = require('./routes/files')({
		actions,
	});
	const blobRoute = require('./routes/blob')({
		actions,
	});
	const repoRoute = require('./routes/repository')({
		actions,
		commitsRoute,
		filesRoute,
		blobRoute,
	});
	const apiRoute = require('./routes/api')({
		actions,
		repoRoute,
	});

	return apiRoute;
};
