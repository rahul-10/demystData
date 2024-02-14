const axios = require('axios');
const { getTodoCountUtil, fetchTodoUtil } = require('../src/todoManager');
const { getUserInput } = require('../src/userInput');

jest.mock('../src/userInput', () => ({
	getUserInput: jest.fn(),
}));

console.warn = jest.fn();
console.error = jest.fn();
process.exit = jest.fn();
jest.mock('axios');

describe('todoManager', () => {
	describe('getTodoCountUtil', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('returns a valid number within the specified range', async () => {
			getUserInput.mockResolvedValueOnce(50);
			const result = await getTodoCountUtil(10, 100);
			expect(result).toBe(50);
			expect(getUserInput).toHaveBeenCalledTimes(1);
		});

		it('retries for a number less than minCount', async () => {
			getUserInput.mockResolvedValueOnce(5).mockResolvedValueOnce(20);

			const result = await getTodoCountUtil(10, 100);
			expect(result).toBe(20);
			expect(getUserInput).toHaveBeenCalledTimes(2);
			expect(console.warn).toHaveBeenCalledWith(
				`Number can not be less than 10, please retry`
			);
		});

		it('retries for a number more than maxCount', async () => {
			getUserInput.mockResolvedValueOnce(150).mockResolvedValueOnce(80);
			const result = await getTodoCountUtil(10, 100);
			expect(result).toBe(80);
			expect(getUserInput).toHaveBeenCalledTimes(2);
			expect(console.warn).toHaveBeenCalledWith(
				`Number can not be more than 100, please retry`
			);
		});
	});
	describe('fetchTodoUtil', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('fetches TODO data successfully', async () => {
			const sampleData = { id: 1, title: 'Sample Todo', completed: false };
			axios.get.mockResolvedValueOnce({ data: sampleData });

			const result = await fetchTodoUtil(1);

			expect(result).toEqual(sampleData);
			expect(axios.get).toHaveBeenCalledTimes(1);
		});

		it('handles error when fetching TODO data', async () => {
			const errorMessage = 'Failed to fetch data';
			axios.get.mockRejectedValueOnce(new Error(errorMessage));

			try {
				await fetchTodoUtil(1);
			} catch (error) {
				expect(console.error).toHaveBeenCalledWith(
					`Error fetching TODO for id 1: ${errorMessage}`
				);
			}
			expect(axios.get).toHaveBeenCalledTimes(1);
		});
	});
});
