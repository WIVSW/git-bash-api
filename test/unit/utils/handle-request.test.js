const {expect} = require('chai');
const {handleRequest} = require('../../../server/modules/utils');

/**
 */
class ResponseStub {
	/**
	 * @param {number} number
	 * @return {ResponseStub}
	 */
	status(number) {
		this._status = number;
		return this;
	}

	/**
	 * @param {string} message
	 * @param {*} data
	 * @return {ResponseStub}
	 */
	send({message, data}) {
		this._message = message;
		this._data = data;
		return this;
	}

	/**
	 * @return {{data: *, message: string, status: number}}
	 */
	toObject() {
		return {
			status: this._status,
			message: this._message,
			data: this._data,
		};
	}
}

const SUCCESS_MESSAGE = 'SUCCESS';
const ERROR_MESSAGE = 'Unknown error';

const successAction = () => Promise.resolve(SUCCESS_MESSAGE);
const errorAction = () => Promise.reject(ERROR_MESSAGE);
const exceptionAction = () => {
	throw new Error('Doesn\'t matter what');
};

describe('Handle Request', () => {
	it('can process success response', async () => {
		const stub = new ResponseStub();
		await handleRequest(successAction, null, stub);
		const result = stub.toObject();
		expect(result.status).to.be.equal(200);
		expect(result.data).to.be.equal(SUCCESS_MESSAGE);
	});

	it('can process fail response', async () => {
		const stub = new ResponseStub();
		await handleRequest(errorAction, null, stub);
		const result = stub.toObject();
		expect(result.status).to.be.equal(500);
		expect(result.message).to.be.equal(ERROR_MESSAGE);
	});

	it('can process JS error', async () => {
		const stub = new ResponseStub();
		await handleRequest(exceptionAction, null, stub);
		const result = stub.toObject();
		expect(result.status).to.be.equal(500);
		expect(result.message).to.be.equal(ERROR_MESSAGE);
	});
});
