'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var marcadorSchema = Schema ({
    jornada: Number,
    equipo1:{type: Schema.ObjectId, ref: 'equipo'},
    golEquipo1: Number,
    equipo2:{type: Schema.ObjectId, ref: 'equipo'},
    golEquipo2: Number,
});

module.exports = mongoose.model('marcador',marcadorSchema);