const url = require('url');
const {expect} = require('chai');
const {getTestData, getListItemByType} = require('./helpers/repo');

describe('Can trasition', () => {
	it('from files list to directory', async function() {
		const {REPO_NAMES, BRANCH} = getTestData();
		const repoId = REPO_NAMES[0];
		const dirName = await getListItemByType('tree', repoId, BRANCH);

		const text = await this.browser
			.url(`/repository/${repoId}/tree/${BRANCH}`)
			.isExisting('.Table .Text')
			.getText('.Table')
			.element(`a*=${dirName}`)
			.click()
			.getUrl();

		const path = url.parse(text).path;

		expect(path).to.be.equal(`/repository/${repoId}/tree/${BRANCH}/${dirName}`);
	});
});