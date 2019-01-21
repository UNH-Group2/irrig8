var client = require("redis").createClient(process.env.REDIS_URL);
var userRepository = require("../repositories/userRepository");
const {promisify} = require("util");
const getAsync = promisify(client.get).bind(client);

let saveToCache = (key, value, cb)=>{
  client.set(key, value, cb);
};

let existsInCache = (key) =>{
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
    results.map(currentUser => {
      saveToCache(currentUser.userName, currentUser.rachioOAuthToken, () => {
        console.log("saving to cache...");
      });

    });
  });
};

let retrieveValueFromCache = (key) =>{
  return getAsync(key);
};

module.exports.saveToCache = saveToCache;
module.exports.existsInCache = existsInCache;
module.exports.loadOAuthTokens = loadOAuthTokens;
module.exports.retrieveValueFromCache = retrieveValueFromCache;