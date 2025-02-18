const NodeCache = require('node-cache')

const cache = new NodeCache()

module.exports = duration => (req, res, next) => {
    if (req.method !== 'GET') {
        console.log(req.method, req.url)
        console.log('Only caching GET methods')
        return next()
    }

    // Check if key exists in cache
    const key = req.originalUrl
    const cachedResponse = cache.get(key)

    // Send cached result to client
    if (cachedResponse) {
        console.log(`Cache hit for ${key}`)
        return res.send(cachedResponse) // Return to prevent further execution
    } else {
        console.log(`Cache miss for ${key}`)
        
        // Temporarily store res.send to prevent recursive calls
        const originalSend = res.send
        res.send = (body) => {
            cache.set(key, body, duration)  // Cache the response before sending
            originalSend.call(res, body)    // Call the original res.send
        }

        next() // Continue with the next middleware or route handler
    }
}
