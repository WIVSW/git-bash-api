const assert = require('assert');

const CustomPromise = require('../../lib/custom-promise/custom-promise');

const resolvePromiseWithValue = (value) => new CustomPromise((resolve) => {
	setTimeout(() => {
		resolve(value);
	}, 10);
});

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

	it('Can resolve value', (done) => {
		const TEST_VALUE = 42;
		resolvePromiseWithValue(TEST_VALUE)
			.then((data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});
});
