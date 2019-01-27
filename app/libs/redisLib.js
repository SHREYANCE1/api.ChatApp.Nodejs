const check = require('./checkLib')
const redis = require('redis')
let client = redis.createClient()

client.on('connect', () => {
    console.log('redis connection is successful')
})

let getAllUserInHash = (hashName, callback) => {
    client.HGETALL(hashName, (err, result) => {
        console.log(`gettinng all users for hash ${hashName}`)
        if(err){
            console.log(err)
            callback(err,null)
        } else if(check.isEmpty(result)){
            console.log('online user list is empty')
            console.log(result)
            callback(null,{})
        } else {
            console.log(result)
            callback(null, result)
        }
    })
} // end get all user hash

//fn to set new online user
let setOnlineUserInHash = (hashName, key, vaaalue, callback) => {
    console.log(`setting user ${key} with value ${value} in hash ${hashName}}`)

    client.HMSET(hashName, [
        key, vaule
    ], (err, result) => {
        if(err){
            console.log(err)
            callback(err,null)
        } else {
            console.log('user has been set in the hashmap')
            console.log(result)
            callback(null, result)
        }
    })
} // end set-user-in-hash

//functn to delete user fromhash

let deleteUserFromHash = (hashName,key) => {
    client.HDEL(hashName,key);
    return true
}// end delete user from hash

module.exports = {
    getAllUserInHash: getAllUserInHash,
    setOnlineUserInHash: setOnlineUserInHash,
    deleteUserFromHash: deleteUserFromHash
}