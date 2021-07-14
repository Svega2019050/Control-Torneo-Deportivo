'use strict'

var express = require('express');
var equipoController = require('../controllers/equipo.controller');
const mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.put('/:torneoId/equipoSave/:userId',[mdAuth.ensureAuth],equipoController.equipoSave);
api.put('/:userId/:torneoId/equipoEliminar/:equipoId', [mdAuth.ensureAuth], equipoController.equipoEliminar);
api.put('/:userId/:torneoId/equipoUpdate/:equipoId', [mdAuth.ensureAuth], equipoController.equipoUpdate);
api.get('/getEquipo',equipoController.getEquipo);


module.exports = api;