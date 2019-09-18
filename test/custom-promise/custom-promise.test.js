const assert = require('assert');

const CustomPromise = require('../../lib/custom-promise/custom-promise');

describe('Custom Promise', () => {
	it('should throw an Exception if no resolver', () => {
		try {
			new CustomPromise();
		} catch (error) {
			assert.strictEqual(error instanceof TypeError, true);
			assert.strictEqual(error.message,
				'Promise resolver undefined is not a function');
		}
	});
});

console.log(CustomPromise);