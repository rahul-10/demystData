require('dotenv').config();
const axios = require('axios');
const { getUserInput } = require('./userInput');

const DEFAULT_TODO_SOURCE = process.env.DEFAULT_TODO_SOURCE;
const MAX_COUNT_FOR_EVEN_TODO = process.env.MAX_COUNT_FOR_EVEN_TODO;

/**
 *
 * @param {number} id
 * @returns
 */
const fetchTodoUtil = async (id) => {
	try {
		const response = await axios.get(DEFAULT_TODO_SOURCE.replace('_id', id));
		return response.data;
	} catch (error) {
		console.error(`Error fetching TODO for id ${id}:`, error.message);
		process.exit(1);
	}
};

/**
 *
 * @param {number} startId
 * @param {number} endId
 * @param {number} interval
 * @returns
 */
const fetchTodo = (startId, endId, interval) => {
	//even
	const promises = [];
	for (let i = startId; i <= endId; i = i + interval) {
		promises.push(fetchTodoUtil(i));
	}
	return Promise.all(promises);
};

const fetchTodoForEven = async (count) => {
	return fetchTodo(2, 2 * count, 2);
};

const displayTodos = (todos) => {
	todos.forEach((todo) => {
		console.log(
			`For id: ${todo.id}, title: ${todo.title} and completed: ${todo.completed}`
		);
	});
};

const getTodoCountUtil = async (minCount, maxCount) => {
	let numberOfTODOs;
	while (1) {
		numberOfTODOs = await getUserInput();
		if (numberOfTODOs < minCount) {
			console.warn(`Number can not be less than ${minCount}, please retry`);
			continue;
		}
		if (numberOfTODOs > maxCount) {
			console.warn(`Number can not be more than ${maxCount}, please retry`); // Data not available for id more than 200
			continue;
		}
		break;
	}
	return numberOfTODOs;
};

const getTodoCountForEven = async () => {
	return getTodoCountUtil(1, MAX_COUNT_FOR_EVEN_TODO);
};

const consumeTodosForEven = async () => {
	const numberOfTODOs = await getTodoCountForEven(); // fetch count of TODOs
	const allTodos = await fetchTodoForEven(numberOfTODOs); // fetch even TODOs list
	displayTodos(allTodos); // display title and completed fields
};

module.exports = {
	consumeTodosForEven,
	getTodoCountUtil,
	fetchTodo,
	fetchTodoUtil,
};
