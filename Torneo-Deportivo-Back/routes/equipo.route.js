'use strict'

var express = require('express');
var equipoController = require('../controllers/equipo.controller');

var api = express.Router();

api.put('/:torneoId/equipoSave', equipoController.equipoSave);
api.put('/:torneoId/equipoEliminar/:equipoId', equipoController.equipoEliminar);
api.put('/:torneoId/equipoUpdate/:equipoId', equipoController.equipoUpdate);



module.exports = api;