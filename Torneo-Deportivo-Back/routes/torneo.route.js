'use strict'

var express = require('express');
var torneoController = require('../controllers/torneo.controller');
const mdAuth = require('../middlewares/authenticated');

var api = express.Router();


api.put('/:userId/saveTorne', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], torneoController.saveTorne);
api.put('/:userId/updateTorneo/:torneoId', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], torneoController.updateTorneo);
api.put('/:userId/removeTorneo/:torneoId', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], torneoController.removeTorneo);
api.get('/getTorneos',torneoController.getTorneos);

module.exports = api;