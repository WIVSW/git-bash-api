const {isAbsolute, resolve} = require('path');
const express = require('express');
const {exit, cwd} = process;

const input = process.argv[2];

if (!input) {
	console.error('Expect path to repos directory.');
	exit(1);
}
process.env.PATH_TO_REPOS = isAbsolute(input) ? input : resolve(cwd(), input);

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => {
	console.log(`Express server listening on port ${PORT}`);
});

module.exports = app;
