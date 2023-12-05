const express = require('express');
const path = require('node:path');
const cors = require('cors');
const session = require('express-session');
const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(session({
    saveUninitialized:false,
    resave:false,
    secret: 'secretKey_josefergo'
}))

app.set('port', 5050);

app.use(express.json())

const route = require('./routes')
app.use(route)



app.listen(app.get('port'),()=>{
    console.log('https:/localhost/:', app.get('port'));
})