/**
 */
class TreeItem {
	/**
	 * @param {Object} data
	 */
	constructor(data) {
		/**
		 * @type {string}
		 */
		this.mode = data.type;

		/**
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * @type {TreeItem.Types}
		 */
		this.type = data.type;

		/**
		 * @type {string}
		 */
		this.object = data.object;
	}

	/**
	 * @return {boolean}
	 */
	get isFile() {
		return this.type === TreeItem.Types.BLOB;
	}

	/**
	 * @return {boolean}
	 */
	get isDir() {
		return this.type === TreeItem.Types.TREE;
	}
};


/**
 * @enum {string}
 */
TreeItem.Types = {
	TREE: 'tree',
	BLOB: 'blob',
};


export default TreeItem;
