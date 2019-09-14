module.exports = (req, res, next) => {
	req.repositoryId = req.params.repositoryId;

	next();
};
