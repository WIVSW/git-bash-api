/**
 */
class Store {
	/**
	 * @param {function} reducer
	 * @param {Object=} state
	 */
	constructor(reducer, state = {}) {
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

		/**
		 * @type {Array<function>}
		 * @private
		 */
		this._listeners = [];
	}

	/**
	 * @param {Object} action
	 * @return {void}
	 */
	dispatch(action) {
		this._state = this._reducer(action, this._state);
		this._listeners.forEach((listener) => listener());
	}

	/**
	 * @return {Object}
	 */
	getState() {
		return this._state;
	}

	/**
	 * Хотел использовать библиотеку,
	 * но почему-то babel криво работал с наследованием
	 * времени разбираться не было
	 * @param {function} listener
	 * @return {function} unsubscribe function
	 */
	subscribe(listener) {
		this._listeners.push(listener);

		return () => {
			const index = this._listeners.indexOf(listener);
			if (index) {
				this._listeners.splice(index, 1);
			}
		};
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
		if (chain.length > 1) {
			newDispatch = chain.reduce((a, next) => a(next))();
		} else {
			newDispatch = chain[0](() => {});
		}


		return store;
	}
}


export default Store;
