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
		 * @type {Array<(function=)>}
		 * @private
		 */
		this._queue = [];

		try {
			resolver(
				this._resolve.bind(this),
				this._reject.bind(this)
			);
		} catch (error) {
			this._reject(error);
		}
	}

	/**
	 * @param {function=} onFulfilled
	 * @param {function=} onRejected
	 * @return {CustomPromise}
	 */
	CustomPromise.prototype.then = function(onFulfilled, onRejected) {
		this._queue.push([onFulfilled, onRejected]);
		return this;
	};

	/**
	 * @param {*} value
	 */
	CustomPromise.prototype._resolve = function(value) {
		this._changeState(
			CustomPromise.States.FULFILLED,
			value
		);
	};

	/**
	 * @param {*} reason
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
	 */
	CustomPromise.prototype._changeState = function(state, value) {
		this._state = state;

		this._drainQueue(value);
	};

	/**
	 * @param {*} value
	 */
	CustomPromise.prototype._drainQueue = function(value) {
		var index = CustomPromise.StateToIndexMap[this._state];

		while (this._queue.length) {
			var handler = this._queue.shift()[index];

			if (typeof handler === 'function') {
				var newValue;

				try {
					newValue = handler(value);
					this._state = CustomPromise.States.FULFILLED;
				} catch (error) {
					newValue = error;
					this._state = CustomPromise.States.REJECTED;
				}

				this._drainQueue(newValue);
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
