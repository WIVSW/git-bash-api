/* eslint-disable no-var */
;(function() {
	/**
	 * @param {*} resolver
	 * @constructor
	 */
	function CustomPromise(resolver) {
		if (typeof resolver !== 'function') {
			throw new TypeError('Promise resolver ' +
				String(resolver) + ' is not a function');
		}

		/**
		 * @type {CustomPromise.States}
		 * @private
		 */
		this._state = CustomPromise.States.PENDING;

		/**
		 * @type {boolean}
		 * @private
		 */
		this._isExecuted = false;

		/**
		 * @type {*}
		 * @private
		 */
		this._value = null;

		/**
		 * @type {Array<(function=)>}
		 * @private
		 */
		this._queue = [];

		setTimeout(function() {
			try {
				resolver(
					this._onFulfilled.bind(this),
					this._onRejected.bind(this)
				);
			} catch (error) {
				this._onRejected(error);
			}
		}.bind(this), 0);
	}

	/**
	 * @param {function=} onFulfilled
	 * @param {function=} onRejected
	 * @return {CustomPromise}
	 */
	CustomPromise.prototype.then = function(onFulfilled, onRejected) {
		this._queue.push([onFulfilled, onRejected]);

		if (
			this._state !== CustomPromise.States.PENDING &&
			this._queue.length === 1
		) {
			this._drainQueue();
		}

		return this;
	};

	/**
	 * @static
	 * @param {*} value
	 * @return {CustomPromise}
	 */
	CustomPromise.resolve = function(value) {
		return new CustomPromise(function(resolve) {
			resolve(value);
		});
	};

	/**
	 * @static
	 * @param {*} reason
	 * @return {CustomPromise}
	 */
	CustomPromise.reject = function(reason) {
		return new CustomPromise(function(_, reject) {
			reject(reason);
		});
	};

	/**
	 * @param {*} value
	 * @private
	 */
	CustomPromise.prototype._onFulfilled = function(value) {
		this._onExecuted(true, value);
	};

	/**
	 * @param {*} reason
	 * @private
	 */
	CustomPromise.prototype._onRejected = function(reason) {
		this._onExecuted(false, reason);
	};

	/**
	 * @param {boolean} isFulfilled
	 * @param {*} value
	 * @private
	 */
	CustomPromise.prototype._onExecuted = function(isFulfilled, value) {
		if (!this._isExecuted) {
			this._isExecuted = true;
			isFulfilled ? this._resolve(value) : this._reject(value);
		}
	};

	/**
	 * @param {*} value
	 * @private
	 */
	CustomPromise.prototype._resolve = function(value) {
		this._changeState(
			CustomPromise.States.FULFILLED,
			value
		);
	};

	/**
	 * @param {*} reason
	 * @private
	 */
	CustomPromise.prototype._reject = function(reason) {
		this._changeState(
			CustomPromise.States.REJECTED,
			reason
		);
	};

	/**
	 * @param {CustomPromise.States} state
	 * @param {*} value
	 * @private
	 */
	CustomPromise.prototype._changeState = function(state, value) {
		this._state = state;
		this._value = value;
		this._drainQueue();
	};

	/**
	 * @private
	 */
	CustomPromise.prototype._drainQueue = function() {
		var index = CustomPromise.StateToIndexMap[this._state];

		while (this._queue.length) {
			var handler = this._queue.shift()[index];

			if (typeof handler === 'function') {
				var promise;
				try {
					var newValue = handler(this._value);
					if (newValue && newValue.then) {
						promise = newValue;
					} else {
						promise = CustomPromise.resolve(newValue);
					}
				} catch (error) {
					promise = CustomPromise.reject(error);
				}

				promise.then(
					function(value) {
						this._resolve(value);
					}.bind(this),
					function(value) {
						this._reject(value);
					}.bind(this)
				);
				break;
			}
		}
	};

	/**
	 * @enum {string}
	 */
	CustomPromise.States = {
		PENDING: 'pending',
		FULFILLED: 'fulfilled',
		REJECTED: 'rejected',
	};

	/**
	 * @type {Object<CustomPromise.States, number>}
	 */
	CustomPromise.StateToIndexMap = {};
	CustomPromise.StateToIndexMap[CustomPromise.States.PENDING] = -1;
	CustomPromise.StateToIndexMap[CustomPromise.States.FULFILLED] = 0;
	CustomPromise.StateToIndexMap[CustomPromise.States.REJECTED] = 1;

	if (typeof module === 'object' && module.exports) {
		// Очень нужно для тестирования
		module.exports = CustomPromise;
	} else {
		Promise = CustomPromise;
	}
})();
