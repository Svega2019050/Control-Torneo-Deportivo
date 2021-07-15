'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3200;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://admin:admin@cluster0.bb7ba.mongodb.net/Cluster0?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology:
true})
    .then(()=>{
        console.log('Conectado al Base De Datos');
        app.listen(port, ()=>{
            console.log('Servidor de Express Corriendo Exitosamente');
        })
    })
    .catch((err)=>{
        console.log('error al conectarse a la base de Datos',err);
    })