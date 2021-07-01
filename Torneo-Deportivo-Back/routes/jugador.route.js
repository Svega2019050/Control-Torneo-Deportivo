'use strict'

var express = require('express');
var equipoController = require('../controllers/jugador.controller');

var api = express.Router();

api.put('/:equipoId/jugadorSave', equipoController.jugadorSave);
api.put('/:equipoId/jugadorEliminar/:jugadorId', equipoController.jugadorEliminar);
api.put('/:equipoId/jugadorUpdate/:jugadorId', equipoController.jugadorUpdate);


module.exports = api;