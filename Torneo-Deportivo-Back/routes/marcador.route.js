'use strict'

var express = require('express');
var marcadorController = require('../controllers/marcador.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.put('/:userId/marcadorSave/:torneoId', [mdAuth.ensureAuth] ,marcadorController.marcadorSave);

module.exports = api;