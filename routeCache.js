const NodeCache = require('node-cache')

const cache = new NodeCache()


module.exports = duration =>  (req, res, next) => {

    if (req.method !== 'GET') {
        console.log('Only caching GET methods')
        return next()
    }


    //check if key exists in cache
    const key = req.originalUrl
    const cachedResponse = cache.get(key)

    //send cache result to client
    if (cachedResponse) {
        console.log(`Cache hit for ${key}`)
        res.send(cachedResponse)
    } else {
        console.log(`Cache miss for ${key}`)
        res.originalSend = res.send
        res.send = body => {
            res.originalSend(body)
            cache.set(key, body, duration)
        }
        next()
    }

}

// module.exports = {
//     duration
// }