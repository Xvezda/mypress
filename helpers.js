const chainGet = (obj, chain) =>
  chain.split(".").reduce((obj, prop) => obj[prop], obj);

module.exports.chainGet = chainGet;
