/**
 */
class View {
	/**
	 * @param {HTMLElement} $el
	 * @param {Object=} state
	 */
	constructor($el, state = {}) {
		/**
		 * @type {*}
		 * @private
		 */
		this._state = null;

		/**
		 * @type {HTMLElement}
		 * @protected
		 */
		this._$el = $el;

		this.setState(state);
	}

	/**
	 * @param {*} state
	 */
	setState(state) {
		this._state = state;
		this.clear();
		this.render();
	}

	/**
	 * @abstract
	 */
	clear() {}

	/**
	 * @abstract
	 */
	render() {}
}

export default View;
