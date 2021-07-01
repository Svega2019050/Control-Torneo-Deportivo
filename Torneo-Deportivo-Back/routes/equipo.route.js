'use strict'

var express = require('express');
var equipoController = require('../controllers/equipo.controller');
const mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.put('/:torneoId/equipoSave', [mdAuth.ensureAuth], equipoController.equipoSave);
api.put('/:torneoId/equipoEliminar/:equipoId', [mdAuth.ensureAuth], equipoController.equipoEliminar);
api.put('/:torneoId/equipoUpdate/:equipoId', [mdAuth.ensureAuth], equipoController.equipoUpdate);



module.exports = api;