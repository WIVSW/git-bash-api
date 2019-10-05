const {expect} = require('chai');
const {getTestData, findFirstMd, readFile} = require('../helpers/repo');

describe('Blob view', () => {
	it('should display content of file', async function() {
		const {REPO_NAMES, BRANCH} = getTestData();
		const repoId = REPO_NAMES[1];
		const filename = await findFirstMd(repoId, BRANCH);
		const fileContent = await readFile(repoId, BRANCH, `./${filename}`);
		const editorText = await this.browser
			.url(`/repository/${repoId}/blob/${BRANCH}/${filename}`)
			.isExisting('.Editor-Body')
			.getText('.Editor-Body');

		const lines = fileContent.split('\n');

		expect(editorText).to.be.an('string');
		lines.forEach((line) => {
			expect(editorText).to.include(line);
		});
	});
});