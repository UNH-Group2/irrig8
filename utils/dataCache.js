// var client = require("redis").createClient(process.env.REDIS_URL);
var userRepository = require("../repositories/userRepository");

let saveToCache = (data, cb)=>{
  client.set(data, cb);
};

let retrieveFromCache = (key) =>{
  client.exists(key, (err, reply) =>{
    if(reply === 1){
      console.log("key exists in Redis cache");
    }
    else{
      console.log("key doesn't exist in Redis cache");
    }
  });
};

let loadOAuthTokens = () =>{
  userRepository.getOAuthTokens().then(results =>{
    console.log(results);
  });
};

module.exports.saveToCache = saveToCache;
module.exports.retrieveFromCache = retrieveFromCache;
module.exports.loadOAuthTokens = loadOAuthTokens;