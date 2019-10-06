const assert = require('assert');

const CustomPromise = require('../../../lib/custom-promise/custom-promise');

const resolvePromiseWithValue = (value) => new CustomPromise((resolve) => {
	setTimeout(() => {
		resolve(value);
	}, 10);
});

const rejectPromiseWithValue = (value) => new CustomPromise((_, reject) => {
	setTimeout(() => {
		reject(value);
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

	it('Can reject value', (done) => {
		const TEST_VALUE = 42;
		rejectPromiseWithValue(TEST_VALUE)
			.then(null, (data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});

	it('Resolve chain works', (done) => {
		const TEST_VALUE = 42;
		resolvePromiseWithValue(TEST_VALUE)
			.then(null, null)
			.then(null, null)
			.then((data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});

	it('Reject chain works', (done) => {
		const TEST_VALUE = 42;
		rejectPromiseWithValue(TEST_VALUE)
			.then(null, null)
			.then(null, null)
			.then(null, (data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});

	it('Can resolve return usage', (done) => {
		const TEST_VALUE = 42;
		resolvePromiseWithValue(null)
			.then(() => {
				return TEST_VALUE;
			})
			.then((data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});

	it('Can resolve return usage in reject', (done) => {
		const TEST_VALUE = 42;
		rejectPromiseWithValue(null)
			.then(null, () => {
				return TEST_VALUE;
			})
			.then((data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});

	it('Can reject if exception was thrown from resolve', (done) => {
		const TEST_VALUE = 42;
		resolvePromiseWithValue(null)
			.then(() => {
				throw TEST_VALUE;
			})
			.then(null, (data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});

	it('Can reject if exception was thrown from reject', (done) => {
		const TEST_VALUE = 42;
		rejectPromiseWithValue(null)
			.then(null, () => {
				throw TEST_VALUE;
			})
			.then(null, (data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});

	it('Can resolve return promise usage', (done) => {
		const TEST_VALUE = 42;
		resolvePromiseWithValue(null)
			.then(() => {
				return resolvePromiseWithValue(TEST_VALUE);
			})
			.then((data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});

	it('Can resolve return promise usage in reject', (done) => {
		const TEST_VALUE = 42;
		rejectPromiseWithValue(null)
			.then(null, () => {
				return resolvePromiseWithValue(TEST_VALUE);
			})
			.then((data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});

	it('Can reject if rejected promise was return from resolve', (done) => {
		const TEST_VALUE = 42;
		resolvePromiseWithValue(null)
			.then(() => {
				return rejectPromiseWithValue(TEST_VALUE);
			})
			.then(null, (data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});

	it('Can reject if rejected promise was return from reject', (done) => {
		const TEST_VALUE = 42;
		rejectPromiseWithValue(null)
			.then(null, () => {
				return rejectPromiseWithValue(TEST_VALUE);
			})
			.then(null, (data) => {
				assert.strictEqual(data, TEST_VALUE);
				done();
			});
	});

	it('Test from the task description', (done) => {
		const promise = new CustomPromise(function(resolve) {
			resolve(42);
		});

		promise
			.then(function(value) {
				return value + 1;
			})
			.then(function(value) {
				assert.strictEqual(value, 43);
				return new CustomPromise(function(resolve) {
					resolve(137);
				});
			})
			.then(function(value) {
				assert.strictEqual(value, 137);
				throw new Error();
			})
			.then(
				function() {},
				function() {
					return 'ошибка обработана';
				}
			)
			.then(function(value) {
				assert.strictEqual(value, 'ошибка обработана');
				done();
			});
	});
});
