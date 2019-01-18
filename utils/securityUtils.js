const crypto = require("crypto");

let hashData = (data) => {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
};

module.exports.hashData = hashData;