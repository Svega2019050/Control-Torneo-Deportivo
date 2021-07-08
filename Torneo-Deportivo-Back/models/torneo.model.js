'use strict'

const mongoose = require("mongoose")
const Schema = mongoose.Schema;

var torneoSchema = Schema({
    name: String,
    dateInit: Date,
    dateEnd: Date,
    imageTorneo: String,
    equipo:[{type: Schema.ObjectId, ref: 'equipo'}],
    marcador:[{type: Schema.ObjectId, ref: 'marcador'}]
});


module.exports = mongoose.model('torneo', torneoSchema);
