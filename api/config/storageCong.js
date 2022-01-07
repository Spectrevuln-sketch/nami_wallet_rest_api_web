if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const Storage = {

    mongodb: {
        url: process.env.MONGODB_URL || "mongodb://localhost:27017/nami"
    }
}

module.exports = Storage;