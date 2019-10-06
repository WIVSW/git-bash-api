const url = require('url');
const {expect} = require('chai');
const {getTestData, getListItemByType} = require('./helpers/repo');

const getUrlAfterClick = async (browser, wrapper, uri, name) => {
	const text = await browser
		.url(uri)
		.isExisting('.Table .Text')
		.getText(wrapper)
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
			'.Table',
			`/repository/${repoId}/tree/${BRANCH}`,
			name
		);

		expect(path).to.be.equal(`/repository/${repoId}/tree/${BRANCH}/${name}`);
	});

	it('from files list to file', async function() {
		const {REPO_NAMES, BRANCH} = getTestData();
		const repoId = REPO_NAMES[0];
		const name = await getListItemByType('blob', repoId, BRANCH);
		const path = await getUrlAfterClick(
			this.browser,
			'.Table',
			`/repository/${repoId}/tree/${BRANCH}`,
			name
		);

		expect(path).to.be.equal(`/repository/${repoId}/blob/${BRANCH}/${name}`);
	});

	it('from breadcrumbs to files list', async function() {
		const {REPO_NAMES, BRANCH} = getTestData();
		const repoId = REPO_NAMES[0];
		const name = await getListItemByType('tree', repoId, BRANCH);
		const path = await getUrlAfterClick(
			this.browser,
			'.Breadcrumbs',
			`/repository/${repoId}/tree/${BRANCH}/${name}`,
			BRANCH
		);

		expect(path).to.be.equal(`/repository/${repoId}/tree/${BRANCH}`);
	});
});
