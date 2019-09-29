export default ({dispatch, getState}) => (next) => (action) =>
	action(dispatch, getState)
		.finally(() => next(action));
