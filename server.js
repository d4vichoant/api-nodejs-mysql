const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const express = require('express')
const mysql = require('mysql')
const myconn = require('express-myconnection')
const routesprofile = require('./profiles')
const routesmanager =require('./manager')
const routesmultimedia =require('./multimedia')
const routesprogramacion =require('./programacion')


const app = express()
const cors = require('cors');

const secretKey = process.env.SECRET_KEY;

app.set('port', process.env.PORT || 9600  )
const dbOptions ={
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'homefitgo'
/*     host: 'mysql-135324-0.cloudclusters.net',
    port: 19385,
    user: 'admin',
    password: 'LvLSUCzP',
    database: 'homefitgo' */
}

// Agregar middleware para permitir CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
//middlewares ------------ (programas intermedios)
app.use(myconn(mysql,dbOptions, 'single'))
app.use(express.json())
app.use(cors());

app.use('/media', express.static('media'));
app.use('/multimedia', express.static('multimedia'));
//routes -------------------
app.get('/',(req,res)=>{
    res.send('Welcome to my  API')
})

app.get('/protectedtoken', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: false });
      } else {
        res.json({ message: true });
      }
    });
  });
  

  
app.use('/profiles',routesprofile)
app.use('/manager',routesmanager)
app.use('/multimedia',routesmultimedia)
app.use('/programacion',routesprogramacion)

//server running -----------------
app.listen(app.get('port'),()=>{
    console.log('server running on port',app.get('port'))
})
