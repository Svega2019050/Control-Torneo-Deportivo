'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var userRoutes = require('./routes/user.route');
var torneoRoutes = require('./routes/torneo.route');
var equipoRoute = require('./routes/equipo.route');
var jugadorRoute = require('./routes/jugador.route');
var marcadorRoute = require('./routes/marcador.route');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.use('/api', userRoutes);
app.use('/api', torneoRoutes);
app.use('/api', equipoRoute);
app.use('/api', jugadorRoute);
app.use('/api', marcadorRoute);


module.exports = app;