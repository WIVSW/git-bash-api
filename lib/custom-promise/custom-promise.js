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
	}

	/**
	 * @enum {string}
	 */
	CustomPromise.States = {
		PENDING: 'pending',
		FULFILLED: 'fulfilled',
		REJECTED: 'rejected',
	};

	if (typeof module === 'object' && module.exports) {
		// Очень нужно для тестирования
		module.exports = CustomPromise;
	} else {
		Promise = CustomPromise;
	}
})();
