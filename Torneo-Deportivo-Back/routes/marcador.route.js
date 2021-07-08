'use strict'

var express = require('express');
var marcadorController = require('../controllers/marcador.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();



module.exports = api;