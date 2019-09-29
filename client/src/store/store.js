import EventEmitter from 'event-emitter';

/**
 */
class Store extends EventEmitter {
	/**
	 * @param {function} reducer
	 * @param {Object=} state
	 */
	constructor(reducer, state = {}) {
		super();

		/**
		 * @const {string}
		 */
		this.EVENT_STORE_UPDATE = 'store-update';

		/**
		 * @type {function}
		 * @private
		 */
		this._reducer = reducer;

		/**
		 * @type {Object}
		 * @private
		 */
		this._state = state;
	}

	/**
	 * @param {Object} action
	 * @return {void}
	 */
	dispatch(action) {
		this._state = this._reducer(action);

		this.emit(this.EVENT_STORE_UPDATE);
	}

	/**
	 * @return {Object}
	 */
	getState() {
		return this._state;
	}

	/**
	 * @param {function} listener
	 * @return {function} unsubscribe function
	 */
	subscribe(listener) {
		this.on(this.EVENT_STORE_UPDATE, listener);

		return this.off.bind(this, this.EVENT_STORE_UPDATE, listener);
	}

	/**
	 * @param {function} reducer
	 * @param {Object=} state
	 * @param {Array<function>=} middlewares
	 * @return {Store}
	 */
	static createStore(reducer, state, ...middlewares) {
		if (middlewares.length) {
			return Store.withMiddlewares(middlewares, reducer, state);
		}

		return new Store(reducer, state);
	}

	/**
	 * Это не совсем так как работает редакс.
	 * В applyMiddleware передается сreateStore(),
	 * чтобы потом расширить у store функцию dispatch
	 * путем глубокого клонирование store и определения
	 * нового dispatch. Я встречался с таким способом
	 * наследования на работе и у меня до сих пор
	 * сохранилась психологическая травма.
	 * Надеюсь Вы простите мою вольность:
	 * Я переопрепределил Store по-человечески
	 * и просто возвращаю новый класс, к которому
	 * уже подключены миддлвары.
	 * @param {Array<function>} middlewares
	 * @param {function} reducer
	 * @param {Object=} state
	 * @return {MiddlewaredStore}
	 */
	static withMiddlewares(middlewares, reducer, state) {
		let newDispatch = null;

		/**
		 */
		class MiddlewaredStore extends Store {
			/**
			 * @param {Array<*>} args
			 * @return {void}
			 */
			dispatch(...args) {
				newDispatch(...args);
			}
		};

		const store = new MiddlewaredStore(reducer, state);
		const middlewareApi = {
			dispatch: (...args) => Store.prototype.dispatch.apply(store, args),
			getState: () => Store.prototype.getState.apply(store),
		};
		// Подключаем миддлвары
		const chain = middlewares.map((mw) => mw(middlewareApi));
		// Делаем так, чтобы миддлвар вызывал другой миддлвар,
		// когда закончил выполнение
		newDispatch = chain.reduce((a, next) => a(next));

		return store;
	}
}


export default Store;
