const Response = require('../models/responses/response');
const Success = require('../models/responses/success');
const Unknown = require('../models/responses/unknown');

const handleRequest = async (action, req, res, ...rest) => {
	let response;
	try {
		const data = await action(req, res, ...rest);
		response = new Success(data);
	} catch (error) {
		response = error instanceof Response ? error : new Unknown();
	}
	const {code, message, data} = response;

	res
		.status(code)
		.send({message, data});
};

module.exports = {
	handleRequest,
};
