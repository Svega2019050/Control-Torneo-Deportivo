'use strict'

var express = require('express');
var equipoController = require('../controllers/jugador.controller');
const mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.put('/:equipoId/jugadorSave', [mdAuth.ensureAuth], equipoController.jugadorSave);
api.put('/:equipoId/jugadorEliminar/:jugadorId', [mdAuth.ensureAuth], equipoController.jugadorEliminar);
api.put('/:equipoId/jugadorUpdate/:jugadorId', [mdAuth.ensureAuth], equipoController.jugadorUpdate);


module.exports = api;