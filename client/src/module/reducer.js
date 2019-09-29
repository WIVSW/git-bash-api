export default ({type, payload}, state) => {
	switch (type) {
	case 'LOAD_TREES':
		return Object.assign({}, state, {
			trees: payload,
		});
	default:
		return state;
	}
}