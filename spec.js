let priority = 0;
const withHigherPriority = context => {
	++priority;
	context();
	--priority;
};

class PriorityQueue {
	constructor() {
		this._queue = [];
	}

	enqueue(value) {
		this._queue.push([value, priority]);
		this._queue.sort(([, a], [, b]) => b - a);
	}

	dequeue() {
		const pair = this._queue.shift();

		if (!pair) return;

		const [value, priority] = pair;
		return value;
	}
	get size() { return this._queue.length; }
}

const commandQueue = new PriorityQueue();

const cy = new Proxy({}, {
	get(obj, name) {
		return function (...args) {
			commandQueue.enqueue({name, args});
			return cy;
		}
	}
});

cy.wrap('something')
  .should('equal', 'something')
  .then(() => {
    cy.wrap({hello: 'world'}).its('hello').should('equal', 'world');
  });

const delayed = new Promise(resolve => {
	setTimeout(() => {
		resolve({foo: () => 'bar'});
	}, 1000);
});

cy.wrap(delayed)
  .invoke('foo')
  .should('be.equal', 'bar');

//console.log(commandQueue);

queueMicrotask(execute);
function execute(subject) {
	if (commandQueue.size <= 0) return;

	let promise;
	const command = commandQueue.dequeue();

	switch (command.name) {
		case 'wrap':
			promise = wrap(...command.args);
			break;
		case 'should':
			promise = should(subject, ...command.args);
			break;
		case 'invoke':
			promise = invoke(subject, ...command.args);
			break;
		case 'then':
			promise = then(subject, ...command.args);
			break;
		case 'its':
			promise = its(subject, ...command.args);
			break;
		default:
			promise = Promise.reject(`command ${command.name} not exists`);
			break;
	}
	return promise.then(execute).catch(console.error);
}

function wrap(value) {
	console.log('wrap command invoked:', value);
	if (typeof value === 'object' && 'then' in value) {
		return value;
	}
	return Promise.resolve(value);
}

function should(subject, props, value) {
	console.log('should command invoked:', subject, props, value);
	return Promise.resolve(subject);
}

function invoke(subject, name, ...args) {
	return Promise.resolve(subject[name](...args));
}

function then(subject, callback) {
	withHigherPriority(callback);

	//console.log('commandQueue in then:', commandQueue);
	//console.log('and the subject:', subject);
	return Promise.resolve(subject);
}

function its(subject, props) {
	return Promise.resolve(subject[props]);
}
