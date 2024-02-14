require('dotenv').config();
const readline = require('readline');

const DEFAULT_TODO_COUNT = process.env.DEFAULT_TODO_COUNT;

const getUserInput = () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(
			'Enter the number of TODOs to fetch (Please press ENTER for default value 20): ',
			(answer) => {
				rl.close();
				resolve(parseInt(answer || DEFAULT_TODO_COUNT, 10));
			}
		);
	});
};

module.exports = {
	getUserInput,
};
