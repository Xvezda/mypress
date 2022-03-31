let priority = 0;
const withHigherPriority = (context) => {
  if (typeof context !== "function") {
    throw new TypeError("first argument context is not a function");
  }
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

    const [value, _] = pair;
    return value;
  }

  get size() {
    return this._queue.length;
  }
}

module.exports = {
  withHigherPriority,
  PriorityQueue,
};
