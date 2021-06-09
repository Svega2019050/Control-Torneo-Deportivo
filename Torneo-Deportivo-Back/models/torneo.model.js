'use strict'

const mongoose = require("mongoose")
const Schema = mongoose.Schema;

var torneoSchema = Schema({
    name: String,
    dateInit: Date,
    dateEnd: Date

});


module.exports = mongoose.model('torneo', torneoSchema);
