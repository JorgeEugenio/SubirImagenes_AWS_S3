const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')


//const servicioRoute = require('./routes/servicioRoute')
const principalRoute = require('./routes/principalRoute')
const usuarioRoute = require('./routes/userRoute')
const projectRoute = require('./routes/projectRoute')
const permisoRoute = require('./routes/permisoRoute')
const projectsdetalleRoute = require('./routes/projectsdetalleRoute')
const productsRoute = require('./routes/productRoute')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// middlewares
app.use(morgan('dev'));
app.use(express.json());

app.use('/',principalRoute)
app.use('/',usuarioRoute)
app.use('/',projectRoute)
app.use('/',permisoRoute)
app.use('/',projectsdetalleRoute)
app.use('/',productsRoute)
//app.use('/v1',principalRoute)

app.use('/public', express.static(`${__dirname}/storage/img/`))
module.exports = app