const {expect} = require('chai');
const {getTestData, getFilesList} = require('../helpers/repo');

describe('Repository', () => {
	it('should include all files in directory', async function() {
		const {REPO_NAMES, BRANCH} = getTestData();
		const repoId = REPO_NAMES[0];
		const list = await getFilesList(repoId, BRANCH);
		const tableText = await this.browser
			.url(`/repository/${repoId}/tree/${BRANCH}`)
			.isExisting('.Table .Text') // wait for render
			.getText('.Table');

		expect(tableText).to.be.an('string');
		list.forEach((file) => {
			expect(tableText).to.include(file);
		});
	});
});