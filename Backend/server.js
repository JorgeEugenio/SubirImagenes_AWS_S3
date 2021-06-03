require('dotenv').config()

//app de express
const app = require('./app')
const connectDB = require('./db/mongodb')
const { appConfig, dbConfig } = require('./config');

//node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');

let initApp = async (appConfig, dbConfig) => {
    try {
        await connectDB(dbConfig)
        server.listen(appConfig.port, ()=>console.log(`listen on ${appConfig.port}`))
    } catch (error) {
        console.log(error)
        process.exit(0)
    }
}
initApp(appConfig, dbConfig)