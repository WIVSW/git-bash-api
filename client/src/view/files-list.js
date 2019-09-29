import View from './view';

/**
 */
class FilesList extends View {
	/**
	 * @param {Store} store
	 */
	constructor(store) {
		super(
			document.getElementsByClassName('Table')[0],
			store.getState().trees,
		);

		/**
		 * @type {Store}
		 * @private
		 */
		this._store = store;

		// Да, от событий нужно отписываться,
		// но это синглтон, поэтому пока что
		// отписка от событий - мертвый код
		this._store.subscribe(() => {
			this.setState(this._store.getState().trees);
		});
	}

	/**
	 * @override
	 */
	render() {
		// Начал было реализовывать рендер
		// на DocumentFragment, но слишком много
		// элементов и в любом случае это будет
		// переписывать на jsx.
		let html = `
		<div class="Table-Row Table-Head">
			<div class="Table-Cell Table-Cell_size_m Block_d-space-h_xs">
				<span class="Text Text_size_l">Name</span>
			</div>
			<div class="Table-Cell Table-Cell_size_l Block_d-space-h_xs">
				<span class="Text Text_size_l">Last commit</span>
			</div>
			<div class="Table-Cell Table-Cell_size_xl Block_d-space-h_xs">
				<span class="Text Text_size_l">Commit message</span>
			</div>
			<div class="Table-Cell Table-Cell_size_s Block_d-space-h_xs">
				<span class="Text Text_size_l">Committer</span>
			</div>
			<div class="Table-Cell Table-Cell_size_s Block_d-space-h_xs">
				<span class="Text Text_size_l">Updated</span>
			</div>
		</div>
		`;

		this._state.forEach((tree) => {
			html += this._renderTree(tree);
		});

		this._$el.innerHTML = html;
	}

	/**
	 * @param {CommitsApi.TreeInfo} tree
	 * @return {DocumentFragment}
	 * @private
	 */
	_renderTree(tree) {
		const hash = tree.commit.hash;
		const iconUrl = tree.treeItem.isDir ?
			'../img/folder.svg' : '../img/file.svg';

		return `
			<div class="Table-Row 
			Block_m-space-t_m Block_m-space-b_l Block_m-space-r_xxxl">
				<a href="" class="Table-CellIcon Text
					Text_type_link Icon Icon_v-align_center">
					<img src="../img/arrow-right.svg" alt="">
				</a>
				<div class="Table-Cell Table-Cell_m-width_full
					Table-Cell_order_1 Block_d-space-h_xs Block_m-space-v_m
					Block_m-space-h_xxs">
					<div class="IconPlus">
						<span class="IconPlus-Icon">
							<img src="${iconUrl}" width="12" height="9" alt="">
						</span>
						<span class="Text Text_size_l Text_weight_bold">
							${tree.treeItem.name}
						</span>
					</div>
				</div>
				<div class="Table-Cell Table-Cell_order_3
					Block_d-space-h_xs Block_m-space-v_m Block_m-space-h_xxs">
					<span class="Text Text_size_l">
						<a href="" class="Text_type_link">${hash && hash.short[0] || ''}</a>
					</span>
				</div>
				<div class="Table-Cell Table-Cell_m-width_full 
					Table-Cell_order_2 Block_d-space-h_xs 
					Block_m-space-v_m Block_m-space-h_xxs">
					<span class="Text Text_size_l">
						${tree.commit.subject || ''}
					</span>
				</div>
				<div class="Table-Cell Table-Cell_order_4 
					Block_d-space-h_xs Block_m-space-v_m Block_m-space-h_xxs">
						<a class="Text Text_size_l Table-Person Text_type_person">
							${tree.commit.author}
						</a>
				</div>
				<div class="Table-Cell Table-Cell_order_5 
					Block_d-space-h_xs Block_m-space-v_m Block_m-space-h_xxs">
					<span class="Text Text_size_l">
						${this._formatDate(tree.commit.date)}
					</span>
				</div>
			</div>
		`;
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 * @private
	 */
	_formatDate(date) {
		const month = FilesList.Monthes[date.getMonth()];
		return `${month} ${date.getDay()}, ${date.getFullYear()}`;
	}
}


/**
 * @type {Array<string>}
 */
FilesList.Monthes = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'June',
	'July',
	'Aug',
	'Sept',
	'Oct',
	'Nov',
	'Dec',
];


export default FilesList;
