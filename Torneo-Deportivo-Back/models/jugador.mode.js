'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jugadorSchema = Schema({
    nameJugador: String,
    numberJugador: Number
});

module.exports = mongoose.model('jugador',jugadorSchema);