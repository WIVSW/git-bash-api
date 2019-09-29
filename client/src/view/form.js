import View from './view';

/**
 */
class Form extends View {
	/**
	 * @param {Store} store
	 * @param {Actions} actions
	 */
	constructor(store, actions) {
		super(
			document.getElementsByClassName('PageDescription-Form')[0],
			store.getState().repos,
		);

		/**
		 * @type {Store}
		 * @private
		 */
		this._store = store;

		/**
		 * @type {Actions}
		 * @private
		 */
		this._actions = actions;

		// Да, от событий нужно отписываться,
		// но это синглтон, поэтому пока что
		// отписка от событий - мертвый код
		this._store.subscribe(() => {
			this.setState(this._store.getState().repos);
		});

		this._$el.addEventListener('submit', this._onSubmit.bind(this));

		this._actions.loadRepos();
	}

	/**
	 * @override
	 */
	render() {
		// Начал было реализовывать рендер
		// на DocumentFragment, но слишком много
		// элементов и в любом случае это будет
		// переписывать на jsx.

		let html = '<div>Loading list of repositories...<div>';

		if (this._state.length) {
			html = `
				<div class="Form-Col Form-Col_type_big">
					<input type="text" name="pattern"
						placeholder="Type something" class="Form-Input Form-Control">
				</div>
				<div class="Form-Col">
					<button type="submit" class="Button Form-Button Form-Control">
						Search
					</button>
				</div>
			`;
		}

		this._$el.innerHTML = html;
	}

	/**
	 * @param {Event} event
	 * @private
	 */
	_onSubmit(event) {
		event.preventDefault();
		const input = event.target.querySelector('input[name=pattern]');
		const value = input ? input.value : '';

		if (value) {
			this._actions.loadTrees(null, value);
		}

		input.value = '';
	}
}


export default Form;
