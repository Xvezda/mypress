const { PriorityQueue } = require("./queue.js");
const commands = require("./commands.js");

const commandQueue = new PriorityQueue();
const cy = new Proxy(
  {},
  {
    get(obj, name) {
      return function (...args) {
        commandQueue.enqueue({ name, args });
        return cy;
      };
    },
  }
);

function execute(subject) {
  if (commandQueue.size <= 0) return;

  let promise;
  const { name, args } = commandQueue.dequeue();

  switch (name) {
    case "wrap":
      promise = commands[name](...args);
      break;
    case "should":
    case "invoke":
    case "then":
    case "its":
      promise = commands[name](subject, ...args);
      break;
    default:
      promise = Promise.reject(`command ${command.name} not exists`);
      break;
  }
  return promise.then(execute).catch(console.error);
}

module.exports = { cy, execute };
