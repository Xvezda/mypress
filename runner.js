const fs = require('fs');
const vm = require('vm');

const {cy, execute} = require('./core.js');

fs.readFile('./spec.js', {encoding: 'utf-8'}, (err, data) => {
	vm.runInThisContext(`
		((cy) => {
			${data}
		})
	`)(cy);
	queueMicrotask(execute);
});
