'use strict'

var express = require('express');
var equipoController = require('../controllers/equipo.controller');
const mdAuth = require('../middlewares/authenticated');
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/equipo' })

var api = express.Router();

api.put('/:torneoId/equipoSave/:userId',[mdAuth.ensureAuth],equipoController.equipoSave);

api.put('/:userId/equipoEliminar/:torneoId/:equipoId', [mdAuth.ensureAuth], equipoController.equipoEliminar);
api.put('/:userId/equipoUpdate/:torneoId/:equipoId', [mdAuth.ensureAuth], equipoController.equipoUpdate);
api.get('/getEquipo',equipoController.getEquipo);

api.put('/:userId/uploadImageEquipo/:equipoId', [mdAuth.ensureAuth,upload], equipoController.uploadImageEquipo);
api.get('/:userId/getimageEquipo/:fileName', [mdAuth.ensureAuth,upload], equipoController.getimageEquipo);

api.get("/:userId/getEquipos/:torneoId", mdAuth.ensureAuth, equipoController.getEquipos);

module.exports = api;