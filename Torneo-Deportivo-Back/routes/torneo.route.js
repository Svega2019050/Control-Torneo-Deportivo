'use strict'

var express = require('express');
var torneoController = require('../controllers/torneo.controller');
const mdAuth = require('../middlewares/authenticated');
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/torneo' })

var api = express.Router();


api.put('/:userId/saveTorne', [mdAuth.ensureAuth], torneoController.saveTorne);
api.put('/:userId/updateTorneo/:torneoId', [mdAuth.ensureAuth], torneoController.updateTorneo);
api.put('/:userId/removeTorneo/:torneoId', [mdAuth.ensureAuth], torneoController.removeTorneo);
api.get('/getTorneos',torneoController.getTorneos);

api.put('/:torneoId/uploadImageTorneo/:userId', [mdAuth.ensureAuth,upload], torneoController.uploadImageTorneo);
api.get('/:userId/getImageTorneo/:fileName', [mdAuth.ensureAuth,upload], torneoController.getImageTorneo);

module.exports = api;