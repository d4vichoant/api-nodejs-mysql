const express = require('express')
const mysql = require('mysql')
const myconn = require('express-myconnection')
const routes = require('./profiles')

const app = express()
const cors = require('cors');

app.set('port', process.env.PORT || 9600)
const dbOptions ={
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'homefitgo'
}

// Agregar middleware para permitir CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//middlewares ------------ (programas intermedios)
app.use(myconn(mysql,dbOptions, 'single'))
app.use(express.json())
app.use(cors());

app.use('/media', express.static('media'));
//routes -------------------
app.get('/',(req,res)=>{
    res.send('Welcome to my API')
})

app.use('/profiles',routes)

//server running -----------------
app.listen(app.get('port'),()=>{
    console.log('server running on port',app.get('port'))
})
