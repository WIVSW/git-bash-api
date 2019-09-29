/**
 */
class View {
	/**
	 * @param {HTMLElement} $el
	 * @param {Object=} state
	 */
	constructor($el, state = {}) {
		/**
		 * @type {Object}
		 * @private
		 */
		this._state = {};

		/**
		 * @type {HTMLElement}
		 * @protected
		 */
		this._$el = $el;

		this.setState(state);
	}

	/**
	 * @param {Object} state
	 */
	setState(state) {
		this._state = Object.assign({}, this._state, state);
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
