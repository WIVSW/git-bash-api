const url = require('url');
const {expect} = require('chai');
const {getTestData, getListItemByType} = require('./helpers/repo');

const getUrlAfterClick = async (browser, name, type, repoId, branch) => {
	const text = await browser
		.url(`/repository/${repoId}/tree/${branch}`)
		.isExisting('.Table .Text')
		.getText('.Table')
		.element(`a*=${name}`)
		.click()
		.getUrl();

	return url.parse(text).path;
};

describe('Can trasition', () => {
	it('from files list to directory', async function() {
		const {REPO_NAMES, BRANCH} = getTestData();
		const repoId = REPO_NAMES[0];
		const name = await getListItemByType('tree', repoId, BRANCH);
		const path = await getUrlAfterClick(
			this.browser,
			name,
			'tree',
			repoId,
			BRANCH
		);

		expect(path).to.be.equal(`/repository/${repoId}/tree/${BRANCH}/${name}`);
	});

	it('from files list to file', async function() {
		const {REPO_NAMES, BRANCH} = getTestData();
		const repoId = REPO_NAMES[0];
		const name = await getListItemByType('blob', repoId, BRANCH);
		const path = await getUrlAfterClick(
			this.browser,
			name,
			'blob',
			repoId,
			BRANCH
		);

		expect(path).to.be.equal(`/repository/${repoId}/blob/${BRANCH}/${name}`);
	});
});