import chalk from 'npm:chalk';

export const log = {
	n: () => console.log(),
	c: (m: string) => console.log(m),
	obj: (o: object) => console.log(JSON.stringify(o, null, 2)),
	error: (m: string) => console.error(m),
	profit: (m: string) => console.log(chalk.green(m)),
	loss: (m: string) => console.log(chalk.red(m)),
	info: (m: string) => console.log(chalk.blue(m)),
};
