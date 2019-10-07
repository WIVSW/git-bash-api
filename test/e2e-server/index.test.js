const TEST_PORT = 3050;
process.env.PORT = TEST_PORT;

describe('Server test', () => {
	require('./custom-promise/custom-promise.test');
	require('./crud/crud.test');
	require('./getters/getters.test');
});
