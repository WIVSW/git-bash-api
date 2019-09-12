const assert = require('assert');
const request = require('supertest');

const app = require('../../server');
const agent = request.agent(app);

describe('Basic CRUD test', () => {
	it('GET Hello World!', function(done) {
		agent
			.get('/')
			.expect(200)
			.expect(
				({res}) =>
					assert.strictEqual(res.text, 'Hello World!')
			)
			.end(done);
	});
});
