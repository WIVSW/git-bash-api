module.exports = (req, res, next) => {
	req.hash = req.params.hash;

	next();
};
