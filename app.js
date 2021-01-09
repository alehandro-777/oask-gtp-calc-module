const fs = require('fs')
const config = require('config');
const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./routes/error-handler')

const port = process.env.PORT || 3001;
const connString = config.get('dbConfig.connString');


const connParams = {useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true };

mongoose.connect(connString, connParams);

mongoose.connection.on('error', (err) => {
    console.log('Error Mongobd connection: ' + err)
    process.exit(1)
}
);        

mongoose.connection.once('open', () => { 
    console.log('Mongobd connected Ok')
}); 

process.on('exit', ()=>{
    mongoose.connection.close();
    console.log(`Server stoped, process exit`)
});
//catches ctrl+c event
process.on('SIGINT', ()=>{
    mongoose.connection.close();
    process.exit(1)
});


process.env.RSA_PUBLIC_KEY = fs.readFileSync('./keys/public.key');
process.env. RSA_PRIVATE_KEY = fs.readFileSync('./keys/private.key');

const app = express()
const router = require('./routes')

//app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());

// parse various different custom JSON types as JSON
app.use(bodyParser.json())

app.use('', router)

app.use('/', express.static(__dirname ));

fs.existsSync("images") || fs.mkdirSync("images");

app.use('/images', express.static(__dirname + '/images'));

// global error handler
app.use(errorHandler);


console.log(`Server started at port: ${port}`)
app.listen(port)