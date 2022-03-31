const { withHigherPriority } = require("./queue.js");
const { chainGet } = require("./helpers.js");

function its(subject, props) {
  return Promise.resolve(chainGet(subject, props));
}

function invoke(subject, name, ...args) {
  return Promise.resolve(subject[name](...args));
}

function should(subject, props, value) {
  console.log("should command invoked:", subject, props, value);
  return Promise.resolve(subject);
}

function then(subject, callback) {
  withHigherPriority(callback);

  //console.log('commandQueue in then:', commandQueue);
  //console.log('and the subject:', subject);
  return Promise.resolve(subject);
}

function wrap(value) {
  console.log("wrap command invoked:", value);
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
