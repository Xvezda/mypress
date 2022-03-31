const { withHigherPriority } = require("./queue.js");
const { chainGet } = require("./helpers.js");

function its(subject, props) {
  console.log("its", subject, props);
  return Promise.resolve(chainGet(subject, props));
}

function invoke(subject, name, ...args) {
  console.log("invoke", subject, name, args);
  return Promise.resolve(subject[name](...args));
}

function should(subject, props, value) {
  console.log("should", subject, props, value);
  return Promise.resolve(subject);
}

function then(subject, callback) {
  console.log("then", subject, callback);
  return new Promise((resolve) => {
    withHigherPriority(() => {
      const result = callback(subject);
      if (typeof result === "undefined") {
        resolve(subject);
      } else {
        resolve(result);
      }
    });
  });
}

function wrap(value) {
  console.log("wrap", value);
  if (typeof value === "object" && "then" in value) {
    return value;
  }
  return Promise.resolve(value);
}

module.exports = {
  its,
  invoke,
  should,
  then,
  wrap,
};
