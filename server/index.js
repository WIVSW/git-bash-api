const {isAbsolute, resolve} = require('path');
const fs = require('fs');
const express = require('express');
const {exit, cwd} = process;
const apiRoute = require('./routes/api');

if (!process.env.PATH_TO_REPOS) {
	const input = process.argv[2];

	if (!input) {
		console.error('Expect path to repos directory.');
		exit(1);
	}
	process.env.PATH_TO_REPOS = isAbsolute(input) ? input : resolve(cwd(), input);
}

if (!fs.existsSync(process.env.PATH_TO_REPOS)) {
	fs.mkdirSync(process.env.PATH_TO_REPOS, {
		recursive: true,
	});
}

const app = express();
const PORT = process.env.PORT || 4554;

app.use(express.json());
app.use(express.static(resolve(__dirname, '../client-react/build')));
app.use('/api', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept');
	next();
}, apiRoute);
app.use((req, res) =>
	res.sendFile(resolve(__dirname, `../client-react/build/index.html`)));

app.listen(PORT, () => {
	console.log(`App is running on http://localhost:${PORT}/`);
});

module.exports = app;
