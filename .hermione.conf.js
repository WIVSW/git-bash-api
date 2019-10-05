module.exports = {
	baseUrl: 'http://localhost:4554/',
	gridUrl: 'http://localhost:4444/wd/hub',

	browsers: {
		chrome: {
			desiredCapabilities: {
				browserName: 'chrome',
			}
		},
	},
};
